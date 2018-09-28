<template>
  <router-link :to="{name: 'event', params: {id: id, tab: 'home'}}" tag="tr">
    <td>{{ event ? event.type : "" }}</td>
    <td>{{ event ? event.name : "" }}</td>
    <td><date-format v-if="event" :time="event.date" /></td>
    <td>{{ event ? event.location : "" }}</td>
  </router-link>
</template>

<script>
import DateFormat from "@/components/DateFormat";

export default {
  name: "EventListRow",
  props: ["id"],
  components: {
    DateFormat
  },
  data: () => ({
    dbRefs: ["dbRef"]
  }),
  computed: {
    dbRef() {
      if (this.id) return "events/" + this.id;
      else return null;
    },
    event() {
      return this.db[this.dbRef];
    }
  }
};
</script>

<style>
</style>
