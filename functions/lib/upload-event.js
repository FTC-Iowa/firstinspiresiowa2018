"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const path = require("path");
const os = require("os");
const AdmZip = require("adm-zip");
const ShortId = require("shortid");
//  import {Timestamp, WriteBatch, WriteResult} from 'firebase-admin/node_modules/@google-cloud/firestore';
admin.initializeApp();
const bucket = admin.storage().bucket();
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
function readZipEntry(entry) {
    return entry.getData().toString('utf8');
}
const dbEvents = db.collection('events');
const dbTeams = db.collection('teams');
const dbMatches = db.collection('matches');
const dbAdmin = db.collection('admin');
const dbLeagues = db.collection('leagues');
var EventTypes;
(function (EventTypes) {
    EventTypes["LEAGUE_MEET"] = "LeagueMeet";
})(EventTypes || (EventTypes = {}));
var MatchTypes;
(function (MatchTypes) {
    MatchTypes["PRACTICE"] = "Practice";
    MatchTypes["QUALIFICATION"] = "Qualification";
    MatchTypes["SEMIFINAL"] = "Semifinal";
    MatchTypes["FINAL"] = "Final";
})(MatchTypes || (MatchTypes = {}));
function getMatchType(index) {
    switch (index) {
        case 0: return MatchTypes.PRACTICE;
        case 1: return MatchTypes.QUALIFICATION;
        case 2: return MatchTypes.SEMIFINAL;
        case 3: return MatchTypes.FINAL;
        default: return null;
    }
}
class Event {
    constructor(request) {
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
                }, {
                    icon: 'people',
                    name: 'teams',
                    route: 'event-teams'
                }, {
                    icon: 'reorder',
                    name: 'matches',
                    route: 'event-matches'
                }, {
                    icon: 'toc',
                    name: 'rankings',
                    route: 'event-rank'
                }],
            teams: [],
            matches: []
        };
        switch (this.data.type) {
            case EventTypes.LEAGUE_MEET:
                this.data.meet_number = request.number;
                this.data.league = request.league;
                // this.data.tabs.push(...);
                break;
        }
    }
    commitToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const ref = dbEvents.doc(this.data.id);
            const data = Object.assign({}, this.data);
            console.log('data:', data);
            this.dbBatch.set(ref, data, { merge: true });
            return this.dbBatch.commit();
        });
    }
    parseFile(file) {
        console.log('file:', file.name);
        switch (file.name) {
            case 'matches.txt':
                this.parseMatches(readZipEntry(file));
                break;
            case 'teams.txt':
                this.parseTeams(readZipEntry(file));
                break;
        }
    }
    parseTeams(text) {
        console.log('Parsing Teams');
        const rows = text.split('\r\n');
        rows.pop();
        rows.forEach(row => {
            const cols = row.split("|");
            let c = 1; // skip division for now
            const number = parseInt(cols[c++]);
            // don't actually update these values in the db
            /*team.name = */ cols[c++];
            /*team.school = */ cols[c++];
            /*team.city = */ cols[c++];
            /*team.state = */ cols[c++];
            /*team.country = */ cols[c++];
            c++; // already advanced
            const participating = cols[c++] === "true";
            if (participating) {
                const team = {
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
                this.dbBatch.update(teamRef, { events: admin.firestore.FieldValue.arrayUnion(this.data.id) });
            }
        });
    }
    parseMatches(text) {
        console.log('Parsing Matches');
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
            for (let k = 0; k < startTimeCnt; k++) {
                startTime = parseInt(cols[c++]);
            }
            c++; // dummy
            const red = {
                teams: [
                    { number: parseInt(cols[c++]) },
                    { number: parseInt(cols[c++]) },
                    { number: parseInt(cols[c++]) }
                ]
            };
            const blue = {
                teams: [
                    { number: parseInt(cols[c++]) },
                    { number: parseInt(cols[c++]) },
                    { number: parseInt(cols[c++]) }
                ]
            };
            let state = parseInt(cols[c++]);
            if (state === 1)
                red.teams[0].nowshow = true;
            if (state === 2)
                red.teams[0].disqualified = true;
            state = parseInt(cols[c++]);
            if (state === 1)
                red.teams[1].nowshow = true;
            if (state === 2)
                red.teams[1].disqualified = true;
            state = parseInt(cols[c++]);
            if (state === 1)
                red.teams[2].nowshow = true;
            if (state === 2)
                red.teams[2].disqualified = true;
            if (parseInt(cols[c++]) === 1)
                red.teams[0].yellow = true;
            if (parseInt(cols[c++]) === 1)
                red.teams[1].yellow = true;
            if (parseInt(cols[c++]) === 1)
                red.teams[2].yellow = true;
            state = parseInt(cols[c++]);
            if (state === 1)
                blue.teams[0].nowshow = true;
            if (state === 2)
                blue.teams[0].disqualified = true;
            state = parseInt(cols[c++]);
            if (state === 1)
                blue.teams[1].nowshow = true;
            if (state === 2)
                blue.teams[1].disqualified = true;
            state = parseInt(cols[c++]);
            if (state === 1)
                blue.teams[2].nowshow = true;
            if (state === 2)
                blue.teams[2].disqualified = true;
            if (parseInt(cols[c++]) === 1)
                blue.teams[0].yellow = true;
            if (parseInt(cols[c++]) === 1)
                blue.teams[1].yellow = true;
            if (parseInt(cols[c++]) === 1)
                blue.teams[2].yellow = true;
            if (parseInt(cols[c++]) === 1)
                red.teams[0].surrogate = true;
            if (parseInt(cols[c++]) === 1)
                red.teams[1].surrogate = true;
            if (parseInt(cols[c++]) === 1)
                red.teams[2].surrogate = true;
            if (parseInt(cols[c++]) === 1)
                blue.teams[0].surrogate = true;
            if (parseInt(cols[c++]) === 1)
                blue.teams[1].surrogate = true;
            if (parseInt(cols[c++]) === 1)
                blue.teams[2].surrogate = true;
            if (red.teams[2].number === 0)
                red.teams.pop();
            if (blue.teams[2].number === 0)
                blue.teams.pop();
            const saved = parseInt(cols[c++]) === 1;
            [red.score, c] = this.parseMatchScore(cols, c);
            [blue.score, c] = this.parseMatchScore(cols, c);
            const match = {
                division: division,
                type: type,
                number: number,
                startTime: new admin.firestore.Timestamp(startTime, 0),
                red: red,
                blue: blue,
                saved: saved,
                id: id
            };
            const matchRef = dbMatches.doc(id);
            this.dbBatch.create(matchRef, match);
            this.data.matches.push(id);
            // add match to teams
            red.teams.forEach(team => {
                if (team.number > 0) {
                    const teamRef = dbTeams.doc(String(team.number));
                    this.dbBatch.update(teamRef, { matches: admin.firestore.FieldValue.arrayUnion(id) });
                }
            });
            blue.teams.forEach(team => {
                if (team.number > 0) {
                    const teamRef = dbTeams.doc(String(team.number));
                    this.dbBatch.update(teamRef, { matches: admin.firestore.FieldValue.arrayUnion(id) });
                }
            });
        });
    }
    parseMatchScore(cols, _c) {
        const score = {};
        let c = _c;
        score.auto = {
            jewlesRemaining: parseInt(cols[c++]),
            glypsInCryptobox: parseInt(cols[c++]),
            cryptoboxKeys: parseInt(cols[c++]),
            robotsParked: parseInt(cols[c++])
        };
        score.tele = {
            glyphsScored: parseInt(cols[c++]),
            completedRows: parseInt(cols[c++]),
            completedCols: parseInt(cols[c++]),
            completedCyphers: parseInt(cols[c++])
        };
        score.endgame = {
            relicsInZone1: parseInt(cols[c++]),
            relicsInZone2: parseInt(cols[c++]),
            relicsInZone3: parseInt(cols[c++]),
            relicsUpright: parseInt(cols[c++]),
            robotsBalanced: parseInt(cols[c++])
        };
        score.penalties = {
            minor: parseInt(cols[c++]),
            major: parseInt(cols[c++]),
            minorAwarded: parseInt(cols[c++]),
            majorAwarded: parseInt(cols[c++])
        };
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
exports.uploadEvent = functions.https.onCall((request, context) => __awaiter(this, void 0, void 0, function* () {
    // create event object
    const event = new Event(request);
    // build file paths
    const remoteFilePath = "event-data/" + request.id + ".zip";
    const localFilePath = path.join(os.tmpdir(), request.id + ".zip");
    /// download the zip folder
    try {
        yield bucket.file(remoteFilePath).download({
            destination: localFilePath
        });
    }
    catch (err) {
        console.log('error downloading event file:', err);
        return {
            status: "error",
            message: "Downloading zip folder",
            id: request.id,
            error: err
        };
    }
    /// open zip folder
    const zip = new AdmZip(localFilePath);
    const zipEntries = zip.getEntries();
    zipEntries.forEach(file => {
        if (file.isDirectory === false)
            event.parseFile(file);
    });
    try {
        const rv = yield event.commitToDb();
        console.log('rv: ', rv);
        return {
            status: "success",
            message: "Event created: " + JSON.stringify(event.data),
            // rv: rv,
            id: request.id
        };
    }
    catch (err) {
        console.error("error:", err);
        return {
            status: "error",
            message: "Commiting event to DB",
            id: request.id,
            error: err
        };
    }
}));
//# sourceMappingURL=upload-event.js.map