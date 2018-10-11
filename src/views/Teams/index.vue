<template>
  <div>
    <team-list :teams="teamsList"/>

    
  </div>
</template>

<script>
import TeamList from "@/components/TeamList";

export default {
  name: "TeamsView",
  components: {
    TeamList
  },
  data: () => ({
    dbRefs: ["ref"],
    ref: "admin/teams"
  }),
  computed: {
    teamsList() {
      return this.db[this.ref] ? this.db[this.ref].teams : [];
    }
  }
};
</script>

<style>
</style>
