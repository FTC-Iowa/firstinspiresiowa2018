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
admin.initializeApp();
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });
const dbEvents = db.collection('events');
const dbTeams = db.collection('teams');
const dbLeagues = db.collection('leagues');
exports.getTeamList = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        //NOTE: Expects baseUrl?league=aldren or similar
        //Example: http://localhost:5000/firstinspiresiowa2018/us-central1/teamList?league=aldren
        var league = req.query.league;
        console.log(league);
        if (league != "aldren" && league != "armstrong" && league != "burnell" && league != "clark" && league != "faber" && league != "galileo" && league != "glenn" && league != "hammel" && league != "hubble" && league != "johnson" && league != "lovell" && league != "porco" && league != "roman" && league != "rubin" && league != "sagan" && league != "vanallen" && league != "vaughan" && league != "whitson") {
            res.status(400).send("League name not found in database" + league);
        }
        var rawLeagueDoc = yield dbLeagues.doc(league).get();
        var leagueData = rawLeagueDoc.data();
    }
    catch (err) {
        console.log('Error returning team list:', err);
        res.status(400).send("Error getting teams");
    }
    console.log(leagueData);
    console.log(JSON.stringify(rawLeagueDoc));
    console.log(league);
    res.status(200).send(leagueData);
}));
//# sourceMappingURL=get-teamlist.js.map