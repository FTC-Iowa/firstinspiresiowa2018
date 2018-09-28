const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const spawn = require('child-process-promise').spawn;
const path = require("path");
const os = require("os");
//const fs = require('fs');
const AdmZip = require("adm-zip");
const ShortId = require("shortid");

admin.initializeApp();

const bucket = admin.storage().bucket();
const db = admin.firestore();

function readZipEntry(entry) {
  return entry.getData().toString("utf8");
}

function parseMatchScore(cols, c) {
  var score = {
    auto: {},
    tele: {},
    endgame: {},
    penalties: {}
  };

  score.auto.jewlesRemaining = parseInt(cols[c++]);
  score.auto.glypsInCryptobox = parseInt(cols[c++]);
  score.auto.cryptoboxKeys = parseInt(cols[c++]);
  score.auto.robotsParked = parseInt(cols[c++]);

  score.tele.glyphsScored = parseInt(cols[c++]);
  score.tele.completedRows = parseInt(cols[c++]);
  score.tele.completedCols = parseInt(cols[c++]);
  score.tele.completedCyphers = parseInt(cols[c++]);

  score.endgame.relicsInZone1 = parseInt(cols[c++]);
  score.endgame.relicsInZone2 = parseInt(cols[c++]);
  score.endgame.relicsInZone3 = parseInt(cols[c++]);
  score.endgame.relicsUpright = parseInt(cols[c++]);
  score.endgame.robotsBalanced = parseInt(cols[c++]);

  score.penalties.minor = parseInt(cols[c++]);
  score.penalties.major = parseInt(cols[c++]);
  score.penalties.minorAwarded = parseInt(cols[c++]);
  score.penalties.majorAwarded = parseInt(cols[c++]);

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

function parseMatches(rawmatches, eventId) {
  const matchCollection = db.collection("matches");
  const teamCollection = db.collection("teams");
  const batch = db.batch();
  const matchTypes = ["Practice", "Qualification", "Semifinal", "Final"];

  var rows = rawmatches.split("\r\n");
  rows.pop();
  // console.log('#matches: ', rows.length);
  var matches = [];
  rows.forEach((row, i) => {
    // generate an ID for this match
    var id = ShortId.generate();

    var c = 0;
    var match = {};
    match.eventId = eventId;
    var cols = row.split("|");
    match.division = parseInt(cols[c++]);
    match.type = matchTypes[parseInt(cols[c++])];
    match.number = parseInt(cols[c++]);
    var startTimeCnt = parseInt(cols[c++]);
    for (var k = 0; k < startTimeCnt; k++) {
      match.startTime = parseInt(cols[c++]);
    }

    c++; // dummy

    match.red = {};
    match.blue = {};

    match.red.teams = [];
    match.red.teams[0] = { number: parseInt(cols[c++]) };
    match.red.teams[1] = { number: parseInt(cols[c++]) };
    match.red.teams[2] = { number: parseInt(cols[c++]) };

    match.blue.teams = [];
    match.blue.teams[0] = { number: parseInt(cols[c++]) };
    match.blue.teams[1] = { number: parseInt(cols[c++]) };
    match.blue.teams[2] = { number: parseInt(cols[c++]) };

    var state;
    state = parseInt(cols[c++]);
    match.red.teams[0].noshow = state === 1;
    match.red.teams[0].disqualified = state === 2;
    state = parseInt(cols[c++]);
    match.red.teams[1].noshow = state === 1;
    match.red.teams[1].disqualified = state === 2;
    state = parseInt(cols[c++]);
    match.red.teams[2].noshow = state === 1;
    match.red.teams[2].disqualified = state === 2;

    match.red.teams[0].yellow = parseInt(cols[c++]) === 1;
    match.red.teams[1].yellow = parseInt(cols[c++]) === 1;
    match.red.teams[2].yellow = parseInt(cols[c++]) === 1;

    state = parseInt(cols[c++]);
    match.blue.teams[0].noshow = state === 1;
    match.blue.teams[0].disqualified = state === 2;
    state = parseInt(cols[c++]);
    match.blue.teams[1].noshow = state === 1;
    match.blue.teams[1].disqualified = state === 2;
    state = parseInt(cols[c++]);
    match.blue.teams[2].noshow = state === 1;
    match.blue.teams[2].disqualified = state === 2;

    match.blue.teams[0].yellow = parseInt(cols[c++]) === 1;
    match.blue.teams[1].yellow = parseInt(cols[c++]) === 1;
    match.blue.teams[2].yellow = parseInt(cols[c++]) === 1;

    match.red.teams[0].surrogate = parseInt(cols[c++]) === 1;
    match.red.teams[1].surrogate = parseInt(cols[c++]) === 1;
    match.red.teams[2].surrogate = parseInt(cols[c++]) === 1;
    match.blue.teams[0].surrogate = parseInt(cols[c++]) === 1;
    match.blue.teams[1].surrogate = parseInt(cols[c++]) === 1;
    match.blue.teams[2].surrogate = parseInt(cols[c++]) === 1;

    if (match.red.teams[2].number === 0) {
      match.red.teams.pop();
    }
    if (match.blue.teams[2].number === 0) {
      match.blue.teams.pop();
    }

    match.saved = parseInt(cols[c++]) === 1;

    [match.red.score, c] = parseMatchScore(cols, c);
    [match.blue.score, c] = parseMatchScore(cols, c);

    var matchRef = matchCollection.doc(id);
    batch.create(matchRef, match);
    matches.push(id);

    // add match to teams
    match.red.teams.forEach(team => {
      if (team.number > 0) {
        var teamRef = teamCollection.doc(String(team.number));
        // var matches = {};
        // matches[id] = id;
        // batch.set(teamRef,{matches: matches}, {merge:true});
        batch.update(teamRef, {
          matches: admin.firestore.FieldValue.arrayUnion(id)
        });
      }
    });
    match.blue.teams.forEach(team => {
      if (team.number > 0) {
        var teamRef = teamCollection.doc(String(team.number));
        // var matches = {};
        // matches[id] = id;
        // batch.set(teamRef,{matches: matches}, {merge:true});
        batch.update(teamRef, {
          matches: admin.firestore.FieldValue.arrayUnion(id)
        });
      }
    });
  });

  batch
    .commit()
    .then(rv => {
      console.log("Batch finished: ", rv);
      return rv;
    })
    .catch(error => {
      console.error("Batch error: ", error);
      return error;
    });

  return matches;
}

function parseTeams(rawteams, eventId) {
  const collection = db.collection("teams");
  const batch = db.batch();

  var rows = rawteams.split("\r\n");
  rows.pop();

  var teams = [];

  rows.forEach(row => {
    var cols = row.split("|");
    var team = {};
    var c = 1; // skip divison for now
    team.number = parseInt(cols[c++]);
    team.name = cols[c++];
    team.school = cols[c++];
    team.city = cols[c++];
    team.state = cols[c++];
    team.country = cols[c++];
    team.events = {};
    team.events[eventId] = eventId;
    c++; // already advanced
    var participating = cols[c++] === "true";
    if (participating) {
      c = cols.length - 15; // just get rankings for this event
      var ranking = {};
      ranking.matches = [];
      ranking.number = team.number;
      for (var i = 0; i < 5; i++) {
        var match = {};
        match.qp = parseInt(cols[c++]);
        match.rp = parseInt(cols[c++]);
        match.score = parseInt(cols[c++]);
        ranking.matches.push(match);
      }
      teams.push(ranking);

      var ref = collection.doc(String(team.number));
      // console.log('team:', team)
      batch.set(ref, team, { merge: true });
    }
  });

  batch
    .commit()
    .then(rv => {
      console.log("Teams batch finished: ", rv);
      return rv;
    })
    .catch(error => {
      console.error("Teams batch error: ", error);
      return error;
    });

  return teams;
}

// const params = {
//   type: 'LeagueMeet',
//   league: '3NNUN6leY9ZVxS1ycGsB',
//   date: '7/29/19',
//   number: '1',
//   location: 'Des Moines',
//   name: 'League 2 Meet 1',
//   file_name: 'FTC_Data_Test_Meet_1.zip'
// };

exports.uploadEvent = functions.https.onCall(async (data, context) => {
  console.log("upload Event: ", data);

  const filePath = "event-data/" + data.id + ".zip";
  const fileName = data.id + ".zip";
  const tempFilePath = path.join(os.tmpdir(), fileName);

  // download the file from the cloud storage
  try {
    await bucket.file(filePath).download({
      destination: tempFilePath
    });
  } catch (error) {
    return {
      status: "error",
      message: "Downloading zip folder",
      error: error
    };
  }

  // open the zip archive and get a list of entries
  var zip = new AdmZip(tempFilePath);
  var zipEntries = zip.getEntries();

  var rawData = {};
  var eventData = {};

  eventData.id = data.id;
  //eventData.id = ShortId.generate(); // create an event ID
  if (data.eventType === "League Meet") {
    eventData.type = "LeagueMeet";
    eventData.meet_number = data.number;
    eventData.league = data.league;
    eventData.tabs = ["home", "teams", "matches", "rankings"];
    eventData.name = data.name;
    eventData.location = data.location;
    eventData.date = data.date;
  }

  // for each element in the zip folder
  zipEntries.forEach(entry => {
    // console.log('entry:', entry.toString())
    switch (entry.name) {
      case "awards.txt":
        rawData.awards = readZipEntry(entry);
        break;
      case "divisions.txt":
        rawData.divisions = readZipEntry(entry);
        break;
      case "event_data.txt":
        rawData.event_data = readZipEntry(entry);
        break;
      case "match_data.txt":
        rawData.match_data = readZipEntry(entry);
        break;
      case "matches.txt":
        rawData.matches = readZipEntry(entry);
        eventData.matches = parseMatches(rawData.matches, eventData.id);
        break;
      case "team_data.txt":
        rawData.team_data = readZipEntry(entry);
        break;
      case "teams.txt":
        rawData.teams = readZipEntry(entry);
        eventData.teams = parseTeams(rawData.teams, eventData.id);
        break;
    }
  });

  try {
    var ref = db.collection("events").doc(eventData.id);
    var rv = await ref.set(eventData, { merge: true });
    console.log("Created event: ", rv);
    return {
      status: "success",
      message: "Event created!",
      rv: rv,
      id: eventData.id
    };
  } catch (error) {
    return {
      status: "error",
      message: "adding event to DB",
      error: error
    };
  }
});

// Data:
// [
//  {number, name, city, state, country, school, league}
// ]

exports.importTeams = functions.https.onCall(async (data, context) => {
  const teamsCollection = db.collection("teams");
  const leaguesCollection = db.collection("leagues");
  const batch = db.batch();

  data.forEach(team => {
    league = team.league;
    if (league) {
      leagueDoc = leaguesCollection.doc(league);
      batch.update(leagueDoc, {
        teams: admin.firestore.FieldValue.arrayUnion(team.number)
      });
    }
    teamDoc = teamsCollection.doc(String(team.number));
    batch.set(teamDoc, team, { merge: true });
  });

  var rv = await batch.commit();
  return {
    status: "success",
    message: "Teams added",
    rv: rv
  };
});
