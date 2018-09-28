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
    teamsList: []
  }),
  firestore() {
    return {
      teamsList: this.$db.collection("teams")
    };
  }
};
</script>

<style>
</style>
