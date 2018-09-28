<template>
  <div>
    <team-list :teams="event.teams" />
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
  })
};
</script>

<style>
</style>
