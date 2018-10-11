<template>
  <div>
    <router-view :league="league" />
    <fab-menu :items="tabs" v-if="$vuetify.breakpoint.mdAndDown"/>
  </div>
</template>

<script>
import FabMenu from "@/components/FabMenu";

export default {
  name: "LeaguePage",
  props: ["value"],
  components: {
    FabMenu
  },
  data: () => ({
    tabs: [
      {
        name: "home",
        icon: "home",
        route: "league"
      },
      {
        name: "teams",
        icon: "people",
        route: "league-teams"
      },
      {
        name: "events",
        icon: "events",
        route: "league-events"
      },
      {
        name: "Rankings",
        icon: "toc",
        route: "league-rankings"
      }
    ],
    dbRefs: ["dbRef"]
  }),
  computed: {
    dbRef() {
      if (this.$route.params.id) {
        console.log("yep...");
        return "leagues/" + this.$route.params.id;
      } else {
        console.log("nope...");
        return null;
      }
    },
    league() {
      return this.db[this.dbRef];
    }
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
