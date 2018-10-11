<template>
  <div>
    <team-list :teams="teams" />
  </div>
</template>

<script>
import TeamList from "@/components/TeamList";

export default {
  name: "EventTeamsTab",
  props: ["league"],
  components: {
    TeamList
  },
  data: () => ({
    //teams: []
  }),
  computed: {
    teams() {
      if (this.league && this.league.teams) {
        return this.league.teams;
      } else {
        return [];
      }
    }
  }
};
</script>

<style>
</style>
