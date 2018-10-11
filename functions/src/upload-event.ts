import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import path = require('path');
import os = require('os');
import AdmZip = require('adm-zip');
import ShortId = require('shortid');
//  import {Timestamp, WriteBatch, WriteResult} from 'firebase-admin/node_modules/@google-cloud/firestore';

admin.initializeApp();
const bucket = admin.storage().bucket();
const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

function readZipEntry(entry: any): string {
  return entry.getData().toString('utf8');
}

const dbEvents = db.collection('events');
const dbTeams = db.collection('teams');
const dbMatches = db.collection('matches');
const dbAdmin = db.collection('admin');
const dbLeagues = db.collection('leagues');

type Tab = {
  icon: string,
  name: string,
  route: string
}

interface Request {
  type: EventTypes, // event type
  league?: string, // league id
  date: number, // seconds since epoc
  number: number, // league meet number
  location: string, // location
  name: string, // event name
  id: string // event id
}

interface Response {
  status: string,
  message: string,
  error?: string,
  id: string,
}

enum EventTypes {
  LEAGUE_MEET = "LeagueMeet"
}

enum MatchTypes {
  PRACTICE = "Practice",
  QUALIFICATION = "Qualification",
  SEMIFINAL = "Semifinal",
  FINAL = "Final"
}

function getMatchType(index: number): MatchTypes {
  switch(index) {
    case 0: return MatchTypes.PRACTICE;
    case 1: return MatchTypes.QUALIFICATION;
    case 2: return MatchTypes.SEMIFINAL;
    case 3: return MatchTypes.FINAL;
    default: return null;
  }
}

type EventData = {
  id: string;
  type: EventTypes;
  meet_number?: number;
  league?: string;
  tabs: Tab[];
  name: string;
  location: string;
  date: admin.firestore.Timestamp;
  teams: Team[];
  matches: Match[];
}

type MatchScore = {
  auto?: {
    jewlesRemaining: number;
    glypsInCryptobox: number;
    cryptoboxKeys: number;
    robotsParked: number;
    total?: number;
  };
  tele?: {
    glyphsScored: number;
    completedRows: number;
    completedCols: number;
    completedCyphers: number;
    total?: number;
  };
  endgame?: {
    relicsInZone1: number;
    relicsInZone2: number;
    relicsInZone3: number;
    relicsUpright: number;
    robotsBalanced: number;
    total?: number;
  };
  penalties?: {
    minor: number;
    major: number;
    minorAwarded: number;
    majorAwarded: number;
    total?: number;
  };
  total?: number;
}

type MatchAlianceTeam = {
  number: number,
  nowshow?: boolean,
  disqualified?: boolean,
  yellow?: boolean,
  surrogate?: boolean
}

type MatchAliance = {
  teams?: MatchAlianceTeam[];
  score?: MatchScore;
}

type Match = {
  division: number;
  type: string;
  number: number;
  startTime: admin.firestore.Timestamp;
  red: MatchAliance;
  blue: MatchAliance;
  saved: boolean;
  id: string;
}

type Team = {
  number: number;
  matches: {
    qp: number;
    rp: number;
    score: number;
  }[];
}

class Event {
  data: EventData;
  dbBatch: any;

  constructor(request: Request) {
    
    this.dbBatch = db.batch();

    // this.data = new EventData();
    this.data = {
      id: request.id,
      type: request.type,
      name: request.name,
      location: request.location,
      date: new admin.firestore.Timestamp(request.date, 0),
      tabs: [{
        icon: 'home',
        name: 'info',
        route: 'event'
      },{
        icon: 'people',
        name: 'teams',
        route: 'event-teams'
      },{
        icon: 'reorder',
        name: 'matches',
        route: 'event-matches'
      },{
        icon: 'toc',
        name: 'rankings',
        route: 'event-rank'
      }],
      teams: [],
      matches: []
    };

    switch(this.data.type) {
      case EventTypes.LEAGUE_MEET:
        this.data.meet_number = request.number;
        this.data.league = request.league;
        // this.data.tabs.push(...);
        break;
    }
  }

  async commitToDb(): Promise<any[]> {
    const ref = dbEvents.doc(this.data.id);
    const data = Object.assign({}, this.data)
    console.log('data:', data)
    this.dbBatch.set(ref,data, {merge: true});
    return this.dbBatch.commit();
  }

  parseFile(file: any): void {
    console.log('file:', file.name);
    switch(file.name){
      case 'matches.txt':
        this.parseMatches(readZipEntry(file));
        break;
      case 'teams.txt':
        this.parseTeams(readZipEntry(file));
        break;
    }
  }

  parseTeams(text: string): void {
    console.log('Parsing Teams')
    const rows = text.split('\r\n');
    rows.pop();
    rows.forEach(row => {
      const cols = row.split("|");
      let c = 1; // skip division for now
      const number = parseInt(cols[c++]);
      // don't actually update these values in the db
      /*team.name = */cols[c++];
      /*team.school = */cols[c++];
      /*team.city = */cols[c++];
      /*team.state = */cols[c++];
      /*team.country = */cols[c++];
      c++; // already advanced
      const participating = cols[c++] === "true";
      if (participating) {

        const team:Team = {
          number: number,
          matches: []
        };

        // only parse rankings info if the team is at this event
        c = cols.length - 15; // just get rankings for this event.  @TODO fix this for larger events
        for (let i = 0; i < 5; i++) {
          team.matches.push({
            qp: parseInt(cols[c++]),
            rp: parseInt(cols[c++]),
            score: parseInt(cols[c++])
          });
        }
        // add this team with ranking info to the event
        this.data.teams.push(team);

        // add this event to the team
        const teamRef = dbTeams.doc("" + team.number);
        this.dbBatch.update(teamRef, {events: admin.firestore.FieldValue.arrayUnion(this.data.id)})
      }
    })
  }

  parseMatches(text: string): void {
    console.log('Parsing Matches')
    const rows = text.split('\r\n');
    rows.pop();
    rows.forEach((row, i) => {
      let c = 0;
      const id = ShortId.generate();
      const cols = row.split("|");
      const division = parseInt(cols[c++]);
      const type = getMatchType(parseInt(cols[c++]));
      const number = parseInt(cols[c++]);
      const startTimeCnt = parseInt(cols[c++]);
      let startTime = 0;
      for (let k=0; k<startTimeCnt; k++) {
        startTime = parseInt(cols[c++]);
      }
      c++; // dummy
      const red:MatchAliance = {
        teams: [
          {number: parseInt(cols[c++]) },
          {number: parseInt(cols[c++]) },
          {number: parseInt(cols[c++]) }
        ]
      };
      const blue:MatchAliance = {
        teams: [
          {number: parseInt(cols[c++]) },
          {number: parseInt(cols[c++]) },
          {number: parseInt(cols[c++]) }
        ]
      };

      let state = parseInt(cols[c++]);
      if (state === 1) red.teams[0].nowshow = true;
      if (state === 2) red.teams[0].disqualified = true;
      state = parseInt(cols[c++]);
      if (state === 1) red.teams[1].nowshow = true;
      if (state === 2) red.teams[1].disqualified = true;
      state = parseInt(cols[c++]);
      if (state === 1) red.teams[2].nowshow = true;
      if (state === 2) red.teams[2].disqualified = true;
      if (parseInt(cols[c++]) === 1) red.teams[0].yellow = true;
      if (parseInt(cols[c++]) === 1) red.teams[1].yellow = true;
      if (parseInt(cols[c++]) === 1) red.teams[2].yellow = true;

      state = parseInt(cols[c++]);
      if (state === 1) blue.teams[0].nowshow = true;
      if (state === 2) blue.teams[0].disqualified = true;
      state = parseInt(cols[c++]);
      if (state === 1) blue.teams[1].nowshow = true;
      if (state === 2) blue.teams[1].disqualified = true;
      state = parseInt(cols[c++]);
      if (state === 1) blue.teams[2].nowshow = true;
      if (state === 2) blue.teams[2].disqualified = true;
      if (parseInt(cols[c++]) === 1) blue.teams[0].yellow = true;
      if (parseInt(cols[c++]) === 1) blue.teams[1].yellow = true;
      if (parseInt(cols[c++]) === 1) blue.teams[2].yellow = true;

      if (parseInt(cols[c++]) === 1) red.teams[0].surrogate = true;
      if (parseInt(cols[c++]) === 1) red.teams[1].surrogate = true;
      if (parseInt(cols[c++]) === 1) red.teams[2].surrogate = true;
      if (parseInt(cols[c++]) === 1) blue.teams[0].surrogate = true;
      if (parseInt(cols[c++]) === 1) blue.teams[1].surrogate = true;
      if (parseInt(cols[c++]) === 1) blue.teams[2].surrogate = true;

      if (red.teams[2].number === 0) red.teams.pop();
      if (blue.teams[2].number === 0) blue.teams.pop();

      const saved = parseInt(cols[c++]) === 1;
      [red.score, c] = this.parseMatchScore(cols, c);
      [blue.score, c] = this.parseMatchScore(cols, c);

      const match:Match = {
        division: division,
        type: type,
        number: number,
        startTime: new admin.firestore.Timestamp(startTime, 0),
        red: red,
        blue: blue,
        saved: saved,
        id: id
      }

      const matchRef = dbMatches.doc(id);
      this.dbBatch.create(matchRef, match);
      this.data.matches.push(id);

      // add match to teams
      red.teams.forEach(team => {
        if (team.number > 0) {
          const teamRef = dbTeams.doc(String(team.number));
          this.dbBatch.update(teamRef, {matches: admin.firestore.FieldValue.arrayUnion(id)});
        }
      })
      blue.teams.forEach(team => {
        if (team.number > 0) {
          const teamRef = dbTeams.doc(String(team.number));
          this.dbBatch.update(teamRef, {matches: admin.firestore.FieldValue.arrayUnion(id)});
        }
      })

    })
  }

  parseMatchScore(cols: string[], _c: number): [MatchScore, number] {
    const score:MatchScore = {};
    let c = _c;

    score.auto = {
      jewlesRemaining: parseInt(cols[c++]),
      glypsInCryptobox: parseInt(cols[c++]),
      cryptoboxKeys: parseInt(cols[c++]),
      robotsParked: parseInt(cols[c++])
    }

    score.tele = {
      glyphsScored: parseInt(cols[c++]),
      completedRows: parseInt(cols[c++]),
      completedCols: parseInt(cols[c++]),
      completedCyphers: parseInt(cols[c++])
    }

    score.endgame = {
      relicsInZone1: parseInt(cols[c++]),
      relicsInZone2: parseInt(cols[c++]),
      relicsInZone3: parseInt(cols[c++]),
      relicsUpright: parseInt(cols[c++]),
      robotsBalanced: parseInt(cols[c++])
    }
    
    score.penalties = {
      minor: parseInt(cols[c++]),
      major: parseInt(cols[c++]),
      minorAwarded: parseInt(cols[c++]),
      majorAwarded: parseInt(cols[c++])
    }

    score.auto.total =
      30 * score.auto.jewlesRemaining +
      15 * score.auto.glypsInCryptobox +
      30 * score.auto.cryptoboxKeys +
      10 * score.auto.robotsParked;

    score.tele.total =
      2 * score.tele.glyphsScored +
      10 * score.tele.completedRows +
      20 * score.tele.completedCols +
      30 * score.tele.completedCyphers;

    score.endgame.total =
      10 * score.endgame.relicsInZone1 +
      20 * score.endgame.relicsInZone2 +
      40 * score.endgame.relicsInZone3 +
      15 * score.endgame.relicsUpright +
      20 * score.endgame.robotsBalanced;

    score.penalties.total =
      10 * score.penalties.minorAwarded + 40 * score.penalties.majorAwarded;

    score.total =
      score.auto.total +
      score.tele.total +
      score.endgame.total +
      score.penalties.total;

    return [score, c];
  }
}




export const uploadEvent = functions.https.onCall(async (request: Request, context): Promise<Response> => {
  // // create event object
  // const event = new Event(request);

  // // build file paths
  // const remoteFilePath = "event-data/" + request.id + ".zip";
  // const localFilePath = path.join(os.tmpdir(), request.id + ".zip");

  // /// download the zip folder
  // try {
  //   await bucket.file(remoteFilePath).download({
  //     destination: localFilePath
  //   });
  // } catch (err) {
  //   console.log('error downloading event file:', err);
  //   return {
  //     status: "error",
  //     message: "Downloading zip folder",
  //     id: request.id,
  //     error: err
  //   };
  // }

  // /// open zip folder
  // const zip = new AdmZip(localFilePath);
  // const zipEntries = zip.getEntries();

  // zipEntries.forEach(file => {
  //   if (file.isDirectory === false) event.parseFile(file)
  // });

  // try {
  //   const rv = await event.commitToDb();
  //   console.log('rv: ', rv);
  //   return {
  //     status: "success",
  //     message: "Event created: " + JSON.stringify(event.data),
  //     // rv: rv,
  //     id: request.id
  //   };
  // } catch (err) {
  //   console.error("error:", err)
  //   return {
  //     status: "error",
  //     message: "Commiting event to DB",
  //     id: request.id,
  //     error: err
  //   };
  // }
  return {
    status: "success",
    message: "Event uploaded.  Parsing not yet supported",
    id: request.id,
  }
});
