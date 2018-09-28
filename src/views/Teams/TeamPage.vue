<template>
  <div>
    <v-tabs-items :value="value" v-if="team">
      <v-tab-item
        v-for="tab in tabs"
        :key="tab"
        :id="tab"
      >
        <component :is="tabMap[tab]" :key="tab" :team="team"/>
      </v-tab-item>
    </v-tabs-items>
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

export default {
  name: "TeamPage",
  props: ["value"],
  data: () => ({
    tabMap: {
      home: HomeTab,
      events: EventTab,
      matches: MatchesTab,
      awards: AwardsTab
    },
    tabs: ["home", "events", "matches", "awards"],
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
