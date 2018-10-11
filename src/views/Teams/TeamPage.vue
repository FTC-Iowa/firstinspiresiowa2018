<template>
  <div>
    <!-- <v-tabs-items :value="value" v-if="team">
      <v-tab-item
        v-for="tab in tabs"
        :key="tab"
        :id="tab"
      >
        <component :is="tabMap[tab]" :key="tab" :team="team"/>
      </v-tab-item>
    </v-tabs-items> -->

    <v-card v-if="team">
      <router-view :team="team" />
      <fab-menu :items="tabs" />
    </v-card>
    <div v-else class="text-xs-center">
      
      <v-progress-circular
        :size="200"
        :width="10"
        color="primary"
        indeterminate
        style="margin:50px"
      />
      <h2>Loading</h2>
    </div>

  </div>
</template>

<script>
import HomeTab from "./HomeTab";
import EventTab from "./EventTab";
import MatchesTab from "./MatchesTab";
import AwardsTab from "./AwardsTab";
import FabMenu from "@/components/FabMenu";

export default {
  name: "TeamPage",
  props: ["value"],
  components: {
    FabMenu
  },
  data: () => ({
    tabMap: {
      home: HomeTab,
      events: EventTab,
      matches: MatchesTab,
      awards: AwardsTab
    },
    tabs: [
      {
        name: "home",
        icon: "home",
        route: "team"
      },
      {
        name: "events",
        icon: "events",
        route: "team-events"
      },
      {
        name: "matches",
        icon: "reorder",
        route: "team-matches"
      },
      {
        name: "Awards",
        icon: "stars",
        route: "team-awards"
      }
    ],
    dbRefs: ["dbRef"]
  }),
  computed: {
    dbRef() {
      if (this.$route.params.id) {
        return "teams/" + this.$route.params.id;
      } else {
        return null;
      }
    },

    team() {
      return this.db[this.dbRef];
    }
  },
  watch: {},
  mounted() {
    this.$emit("setTabs", this.tabs);
  },
  destroyed() {
    this.$emit("setTabs", []);
  }
};
</script>

<style>
</style>
