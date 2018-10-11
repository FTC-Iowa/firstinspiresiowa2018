<template>
  <router-link :to="{name: 'team', params: {id: teamData ? teamData.number : 0, tab: 'home' }}" tag="tr">
    <td>{{ teamData ? teamData.number : "" }}</td>
    <td>{{ teamData ? teamData.name : "" }}</td>
    <td>{{ teamData ? teamData.organization : ""}}</td>
    <td>{{ teamData ? teamData.league : "" }}</td>
    <!-- <td>{{ team ? team.organization : "" }}</td> -->
  </router-link>
</template>

<script>
export default {
  name: "TeamListRow",
  props: ["id", "team"],
  data: () => ({
    dbRefs: ["dbRef"],
    dbRef: "admin/teams"
  }),
  computed: {
    // dbRef() {
    //   if (this.team) return null;
    //   if (this.id) return "teams/" + this.id;
    //   else return null;
    // },
    teamData() {
      if (this.team) {
        return this.team;
      } else if (this.db[this.dbRef]) {
        var teams = this.db[this.dbRef].teams;
        var team = teams.filter(t => t.number === this.id)[0];
        return team;
      } else {
        return null;
      }
    }
  }
};
</script>

<style>
</style>
