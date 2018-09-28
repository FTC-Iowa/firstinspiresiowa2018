<template>
  <v-tabs-items :value="value">
    <v-tab-item
      v-for="tab in tabs"
      :key="tab"
      :id="tab"
    >
      <component :is="tabMap[tab]" :key="tab" :league="league"/>
    </v-tab-item>
  </v-tabs-items>
</template>

<script>
import HomeTab from "./HomeTab";
import TeamsTab from "./TeamsTab";
import EventsTab from "./EventsTab";

export default {
  name: "LeaguePage",
  props: ["value"],
  data: () => ({
    tabMap: {
      home: HomeTab,
      teams: TeamsTab,
      events: EventsTab,
      rankings: null
    },
    tabs: ["home", "teams", "events", "rankings"],
    league: {}
  }),
  firestore() {
    return {
      league: this.$db.collection("leagues").doc(this.$route.params.id)
    };
  },
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
