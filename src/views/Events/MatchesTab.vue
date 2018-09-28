<template>
  <div>
    <match-list :matches="event.matches" :teams="event.teams"/>
  </div>
</template>

<script>
import MatchList from "@/components/MatchList";

export default {
  name: "EventTeamsTab",
  props: ["event"],
  components: {
    MatchList
  },
  data: () => ({
    //teams: []
  })
};
</script>

<style>
</style>
