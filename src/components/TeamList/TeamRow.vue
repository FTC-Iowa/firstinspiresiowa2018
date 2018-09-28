<template>
  <router-link :to="{name: 'team', params: {id: id, tab: 'home' }}" tag="tr">
    <td>{{ team ? team.number : "" }}</td>
    <td>{{ team ? team.name : "" }}</td>
    <td>{{ team ? team.league : "" }}</td>
    <td>{{ team ? team.organization : "" }}</td>
  </router-link>
</template>

<script>
export default {
  name: "TeamListRow",
  props: ["id"],
  data: () => ({
    dbRefs: ["dbRef"]
  }),
  computed: {
    dbRef() {
      if (this.id) return "teams/" + this.id;
      else return null;
    },
    team() {
      return this.db[this.dbRef];
    }
  }
};
</script>

<style>
</style>
