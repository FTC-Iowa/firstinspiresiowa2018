<template>
  <div>
    <v-card>
      <!-- <v-card-title>
        Rankings
        <v-spacer />
        <v-text-field        
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title> -->

      <v-data-table
        :headers="headers"
        :items="rankings"
        hide-actions
        class="elevation-1"
        item-key="rank"
        must-sort
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.rank }}</td>
          <td>{{ props.item.team }}</td>
          <td>{{ props.item.qp }}</td>
          <td>{{ props.item.rp }}</td>
          <td>{{ props.item.highscore }}</td>
        </template>
        
      </v-data-table>

    </v-card>
  </div>
</template>

<script>
export default {
  name: "RankingsTable",
  props: ["event"],
  data: () => ({
    headers: [
      { text: "Rank", value: "rank", align: "center" },
      { text: "Team", value: "team", align: "center" },
      { text: "QP", value: "qp", align: "center" },
      { text: "RP", value: "rp", align: "center" },
      { text: "High Score", value: "highscore", align: "center" }
    ]
  }),
  computed: {
    rankings() {
      if (this.event && this.event.teams) {
        var ranks = [];
        this.event.teams.forEach(team => {
          var rank = {
            team: team.number,
            qp: 0,
            rp: 0,
            scores: []
          };
          team.matches.forEach(match => {
            rank.qp += match.qp;
            rank.rp += match.rp;
            rank.scores.push(match.score);
          });
          rank.scores = rank.scores.sort((a, b) => b - a);
          rank.highscore = rank.scores[0];
          ranks.push(rank);
        });
        var sorted = ranks.sort((a, b) => {
          // return -1 if a is higher ranked than b
          if (a.qp === b.qp) {
            // equal qp, keep working
            if (a.rp === b.rp) {
              // equal rp, keep working
              for (
                var i = 0, j = 0;
                i < a.scores.length && j < b.scores.length;
                i++, j++
              ) {
                if (a.scores[i] > b.scores[j]) return -1;
                else if (a.scores[i] < b.scores[j]) return 1;
              }
              // just use who has played more matches
              return b.scores.length - a.scores.length;
            } else {
              return b.rp - a.rp;
            }
          } else {
            return b.qp - a.qp;
          }
        });
        for (var i = 0; i < sorted.length; i++) {
          sorted[i].rank = i + 1;
        }

        return sorted;
      } else {
        return [];
      }
    }
  }
};
</script>

<style scoped>
td {
  text-align: center;
}
</style>
