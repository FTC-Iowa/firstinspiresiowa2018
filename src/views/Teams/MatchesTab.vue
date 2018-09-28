<template>
  <div>
    <match-list :matches="team.matches"/>
  </div>
</template>

<script>
import MatchList from "@/components/MatchList";

export default {
  name: "EventTeamsTab",
  props: ["team"],
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
