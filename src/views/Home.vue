<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
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
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
// const admin = require('firebase-admin');
// admin.initializeApp();

export default {
  data: () => ({
    text: ""
  }),
  methods: {
    upload() {
      var data = JSON.parse(this.text);
      // console.log("submit", data)
      // var db = this.$db;
      // var teams = db.collection('teams');
      // var leagues = db.collection("leagues");
      var leagueList = [];
      data.forEach(team => {
        // var doc = teams.doc('' + team.number);

        // team.id = team.number;
        if (leagueList[team.league]) {
          leagueList[team.league].teams.push(team.number);
        } else {
          leagueList[team.league] = { teams: [team.number], id: team.league };
        }

        // var doc = leagues.doc(team.league)
        // doc.update  (
        //   {teams: admin.firestore.FieldValue.arrayUnion(team.number)}
        // ).then(() => console.log('success'))
        // .catch((err) => console.error('error: ', err))
      });
      console.log(leagueList);

      // for ( var key in leagueList) {
      //   if (leagueList.hasOwnProperty(key)){
      //     var league = leagueList[key]
      //     console.log('upload: ', league.id)
      //     var doc = leagues.doc(league.id);
      //     doc.set(league, {merge: true}).then(() => console.log('success'))
      //     .catch((err) => console.error('error: ', err))
      //   }
      // }
    }
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
