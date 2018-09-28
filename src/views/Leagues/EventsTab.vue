<template>
  <div v-if="league">
    <event-list :events="league.events"/>
  </div>
</template>

<script>
import EventList from "@/components/EventList";

export default {
  name: "TeamEventTab",
  props: ["league"],
  components: {
    EventList
  }
};
</script>

<style>
</style>
