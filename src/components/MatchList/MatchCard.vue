<template>
  <v-card v-if="match">
    <v-card-title :class="winnerColor">
      <!-- <div> -->
        <h2 class="headline mb-0">{{matchName}}{{winnerString}}</h2>
      <!-- </div> -->
      <v-spacer />
      <v-btn icon>
        <v-icon>notifications_none</v-icon>
      </v-btn>
      <v-btn v-if="winner" icon>
        <v-icon >share</v-icon>
      </v-btn>
      <v-btn v-if="winner" icon @click="showDetails = !showDetails">
        <v-icon v-if="showDetails">keyboard_arrow_up</v-icon>
        <v-icon v-else>keyboard_arrow_down</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <table cellspacing="0" cellpadding="0">
                <!-- <thead>
                    <tr>
                        <th class="firstcol"/>
                        <th >Red Aliance</th>
                        <th >Blue Aliance</th>
                    </tr>
                </thead> -->
                <tbody id="teams">
                    <tr>
                        <th>Teams</th>
                        <td >
                            <span v-if="match.red.teams[0] && match.red.teams[0].number > 0">
                                <router-link tag="span" :to="'/team/' + match.red.teams[0].number + '/home'">
                                  <!-- <router-link tag="v-chip" small color="red" :outline="false" :to="'/team/' + match.red.teams[0].number + '/home'"> -->
                                  <v-chip small color="red" :outline="false">
                                    {{match.red.teams[0].number}} 
                                    <v-icon v-if="match.red.teams[0].surrogate">star</v-icon>
                                  </v-chip>
                                </router-link>
                            </span>
                            <span v-if="match.red.teams[1] && match.red.teams[1].number > 0">
                                <router-link tag="span" :to="'/team/' + match.red.teams[1].number + '/home'">
                                  <v-chip small color="red" :outline="false" >
                                    {{match.red.teams[1].number}} 
                                    <v-icon v-if="match.red.teams[1].surrogate">star</v-icon>
                                  </v-chip>
                                </router-link>
                            </span>
                            <span v-if="match.red.teams[2] && match.red.teams[2].number > 0">
                                <router-link tag="span" :to="'/team/' + match.red.teams[2].number + '/home'">
                                  <v-chip small color="red" :outline="false" >
                                    {{match.red.teams[2].number}} 
                                    <v-icon v-if="match.red.teams[2].surrogate">star</v-icon>
                                  </v-chip>
                                </router-link>
                            </span>
                        </td>
                        <td >
                            <span v-if="match.blue.teams[0] && match.blue.teams[0].number > 0">
                                <router-link tag="span" :to="'/team/' + match.blue.teams[0].number + '/home'">
                                  <v-chip small color="blue" :outline="false" >
                                    {{match.blue.teams[0].number}} 
                                    <v-icon v-if="match.blue.teams[0].surrogate">star</v-icon>
                                  </v-chip>
                                </router-link>
                            </span>
                            <span v-if="match.blue.teams[1] && match.blue.teams[1].number > 0">
                                <router-link tag="span" :to="'/team/' + match.blue.teams[1].number + '/home'">
                                  <v-chip small color="blue" :outline="false" >
                                    {{match.blue.teams[1].number}} 
                                    <v-icon v-if="match.blue.teams[1].surrogate">star</v-icon>
                                  </v-chip>
                                </router-link>
                            </span>
                            <span v-if="match.blue.teams[2] && match.blue.teams[2].number > 0">
                                <router-link tag="span" :to="'/team/' + match.blue.teams[2].number + '/home'">
                                  <v-chip small color="blue" :outline="false" >
                                    {{match.blue.teams[2].number}} 
                                    <v-icon v-if="match.blue.teams[2].surrogate">star</v-icon>
                                  </v-chip>
                                </router-link>
                            </span>
                        </td>
                    </tr>
                </tbody>
                <tbody id="details" v-if="showDetails">
                    <tr>
                        <th>Auto</th>
                        <td >{{match.red.score.auto.total}}</td>
                        <td >{{match.blue.score.auto.total}}</td>
                    </tr>
                    <tr>
                        <th>Tele-Op</th>
                        <td >{{match.red.score.tele.total}}</td>
                        <td >{{match.blue.score.tele.total}}</td>
                    </tr>
                    <tr>
                        <th>End Game</th>
                        <td >{{match.red.score.endgame.total}}</td>
                        <td >{{match.blue.score.endgame.total}}</td>
                    </tr>
                    <tr>
                        <th>Penalties</th>
                        <td >{{match.red.score.penalties.total}}</td>
                        <td >{{match.blue.score.penalties.total}}</td>
                    </tr>
                    <tr>
                        <th>Total</th>
                        <td style="font-weight:bold;">{{match.red.score.total}}</td>
                        <td style="font-weight:bold;">{{match.blue.score.total}}</td>
                    </tr>
                </tbody>
            </table>
    </v-card-text>

    <!-- <v-card-actions>
      <v-btn flat color="primary">text</v-btn>
      <v-btn flat color="primary">text</v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
export default {
  name: "MatchCard",
  props: ["id"],
  data: () => ({
    showDetails: false,
    dbRefs: ["dbRef"]
  }),
  computed: {
    match() {
      return this.db[this.dbRef];
    },

    dbRef() {
      if (this.id) return "matches/" + this.id;
      else return null;
    },

    winner() {
      if (this.match.red.score && this.match.blue.score) {
        if (this.match.red.score.total > this.match.blue.score.total) {
          return "red";
        } else if (this.match.blue.score.total > this.match.red.score.total) {
          return "blue";
        } else {
          return "tie";
        }
      } else {
        return "";
      }
    },
    winnerColor() {
      return {
        "red-won": this.winner === "red",
        "blue-won": this.winner === "blue",
        "tie-won": this.winner === "tie"
      };
    },

    matchName() {
      switch (this.match.type) {
        case "Qualification":
          return "Q-" + this.match.number;
        default:
          return "";
      }
    },

    winnerString() {
      if (this.winner === "red") {
        return (
          ": Red " +
          this.match.red.score.total +
          "-" +
          this.match.blue.score.total
        );
      } else if (this.winner === "blue") {
        return (
          ": Blue " +
          this.match.red.score.total +
          "-" +
          this.match.blue.score.total
        );
      } else if (this.winner === "tie") {
        return (
          ": Tie " +
          this.match.red.score.total +
          "-" +
          this.match.blue.score.total
        );
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card__title {
  padding-top: 0;
  padding-bottom: 0;
}

.tie-won {
  background-color: #bbb;
}

.red-won {
  background-color: #f75b7f;
}

.blue-won {
  background-color: #3399ff;
}

.v-card__text {
  padding: 0;
}

table {
  width: 100%;
  text-align: center;
  tr {
    border-width: 0;
    border: none;
    padding: 0;
    height: 100%;
    th:first-child {
      background: #bbb;
    }
    th:nth-child(2) {
      background: #f75b7f;
    }
    // td:first-of-type {
    //   background: #f75b7f;
    //   a {
    //     color: black;
    //     text-decoration: none;
    //   }
    // }
    th:nth-child(3) {
      background: #3399ff;
    }
    // td:last-of-type {
    //   background: #3399ff;
    //   a {
    //     color: black;
    //     text-decoration: none;
    //   }
    // }
    td,
    th {
      width: 33%;
      padding: 0;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
}
</style>
