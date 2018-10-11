<template>
  <div>
    <team-list :teams="teams" />
  </div>
</template>

<script>
import TeamList from "@/components/TeamList";

export default {
  name: "EventTeamsTab",
  props: ["event"],
  components: {
    TeamList
  },
  data: () => ({
    //teams: []
  }),
  computed: {
    teams() {
      if (this.event && this.event.teams) {
        return this.event.teams;
      } else {
        return [];
      }
    }
  }
};
</script>

<style>
</style>
