import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

//admin.initializeApp();
const db = admin.firestore();
//db.settings({timestampsInSnapshots: true});

const dbLeagues = db.collection('leagues');

export const getTeamList = functions.https.onRequest(async(req, res) => {
    try{
        //NOTE: Expects baseUrl?league=aldren or similar
        //Example: http://localhost:5000/firstinspiresiowa2018/us-central1/teamList?league=aldren
        const league = req.query.league;
        if(league !== "aldren" && league !== "armstrong" && league !== "burnell" && league !== "clark" && league !== "faber" && league !== "galileo" && league !== "glenn" && league !== "hammel" && league !== "hubble" && league !== "johnson" && league !== "lovell" && league !== "porco" && league !== "roman" && league !== "rubin" && league !== "sagan" && league !== "vanallen" && league !== "vaughan" && league !== "whitson")
        {
            res.status(400).send("League name not found in database: " + league);
        }
        const rawLeagueDoc = await dbLeagues.doc(league).get();
        const leagueData = rawLeagueDoc.data();
        res.status(200).send(leagueData);
    }
    catch (err) {
        res.status(400).send("Error getting teams");
    }
});