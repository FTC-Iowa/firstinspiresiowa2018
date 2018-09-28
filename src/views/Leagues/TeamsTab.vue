<template>
  <div>
    <team-list :teams="league.teams" />
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
  })
};
</script>

<style>
</style>
