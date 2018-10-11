<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        Welcome to the FTC Iowa score tracking website.  Event data throught the season will be uploaded and tracked on this site.  
        FTC Iowa and FIRST cannot guarantee the accuracy of this information.  If this data differs from that of the offical score
        system, the offical score system always takes precedence. <br><br>

        To upload event data from a league meet please click the menu in the upper right hand corner of the 
        screen and select "Upload Event". <br><br>

        To report any issues or if you have any questions or comments please contact Jeramie Vens at Jeramie.Vens@gmail.com.
        <!-- <v-btn color="success" @click="run">text</v-btn> -->
        <!-- <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
        <blockquote>
          &#8220;First, solve the problem. Then, write the code.&#8221;

          <v-textarea
            label="Team List..."
            name="name"
            v-model="text"
          ></v-textarea>
          <v-btn color="success" @click="upload">text</v-btn>
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote> -->
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
// const admin = require('firebase-admin');
// admin.initializeApp();

export default {
  data: () => ({
    text: "",
    teamsList: []
  }),
  firestore() {
    return {
      teamsList: this.$db.collection("teams")
    };
  },
  methods: {
    run() {
      console.log(this.teamsList);
      var list = [];
      this.teamsList.forEach(team => {
        console.log("team:", team);
        var t = {
          number: team.number,
          name: team.name,
          league: team.league,
          organization: team.organization
        };
        list.push(t);
      });

      var doc = this.$db.collection("admin").doc("teams");
      var data = {
        teams: list
      };
      doc
        .set(data)
        .then(() => console.log("success"))
        .catch(err => console.error("error: ", err));
    }

    // upload() {
    //   var data = JSON.parse(this.text);
    //   // console.log("submit", data)
    //   // var db = this.$db;
    //   // var teams = db.collection('teams');
    //   // var leagues = db.collection("leagues");
    //   var leagueList = [];
    //   data.forEach(team => {
    //     // var doc = teams.doc('' + team.number);

    //     // team.id = team.number;
    //     if (leagueList[team.league]) {
    //       leagueList[team.league].teams.push(team.number);
    //     } else {
    //       leagueList[team.league] = { teams: [team.number], id: team.league };
    //     }

    //     // var doc = leagues.doc(team.league)
    //     // doc.update  (
    //     //   {teams: admin.firestore.FieldValue.arrayUnion(team.number)}
    //     // ).then(() => console.log('success'))
    //     // .catch((err) => console.error('error: ', err))
    //   });
    //   console.log(leagueList);

    //   // for ( var key in leagueList) {
    //   //   if (leagueList.hasOwnProperty(key)){
    //   //     var league = leagueList[key]
    //   //     console.log('upload: ', league.id)
    //   //     var doc = leagues.doc(league.id);
    //   //     doc.set(league, {merge: true}).then(() => console.log('success'))
    //   //     .catch((err) => console.error('error: ', err))
    //   //   }
    //   // }
    // }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
