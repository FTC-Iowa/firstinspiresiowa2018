<template>
  <v-container fluid grid-list-md>
    <v-data-iterator
      :items="filteredMatches"
      hide-actions
      row
      wrap
      content-tag="v-layout"
    >
      <div slot="header" v-if="teams">
        <v-combobox
          v-model="chips"
          :items="teams"
          item-text="number"
          item-value="number"
          label="Search Teams"
          chips
          clearable
          solo
          multiple
          dense
          small-chips
          :menu-props="{closeOnContentClick: true}"
        >
          <template slot="selection" slot-scope="data">
            <v-chip
              :selected="data.selected"
              close
              @input="remove(data.item)"
            >
              <strong>{{ data.item.number }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </div>

      <v-flex 
        slot="item"
        slot-scope="props"
        xs12
      >
        <match-card :id="props.item" />
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script>
import MatchCard from "./MatchCard";

export default {
  name: "EventAwardsTab",
  props: ["matches", "teams"],
  components: {
    MatchCard
  },
  data: () => ({
    chips: [],
    teamSubs: {}
  }),
  watch: {
    chips: {
      immediate: true,
      handler(newVal) {
        // has memory leak if you remove the chip using anything other than remove() method.
        newVal.forEach(val => {
          if (this.teamSubs[val.number]) {
            // already subscribed to this team
          } else {
            this.teamSubs[val.number] = true;
            this.dbSub("teams/" + val.number, false);
          }
        });
      }
    }
  },
  computed: {
    filteredMatches() {
      if (this.chips.length === 0) {
        return this.matches;
      } else {
        var matches = [];
        this.chips.forEach(team => {
          var t = this.db["teams/" + team.number];
          var tmp = this.intersect(this.matches, t.matches);
          matches = [...matches, ...tmp];
        });
        // console.log('team:', t.matches, ', event:', this.event.matches)
        // var tmp = [...new Set([...this.event.matches, ...t.matches])]
        // console.log('tmp:', tmp)
        // matches = tmp;
        console.log("matches:", matches);
        return [...new Set(matches)];
      }
    }
  },
  methods: {
    remove(item) {
      this.dbUnSub("teams/" + item.number);
      this.teamSubs[item.number] = null;
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    },
    customFilter(items, search, filter) {
      console.log("Search for:", search);
      console.log("Filter for:", filter);
      return items;
    },
    intersect(a, b) {
      var t;
      if (b.length > a.length) (t = b), (b = a), (a = t);
      return a.filter(e => {
        return b.indexOf(e) > -1;
      });
    }
  }
};
</script>

<style>
</style>
