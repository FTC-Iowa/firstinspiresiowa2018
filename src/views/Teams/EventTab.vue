<template>
  <div v-if="team">
    <event-list :events="team.events"/>
  </div>
</template>

<script>
import EventList from "@/components/EventList";

export default {
  name: "TeamEventTab",
  props: ["team"],
  components: {
    EventList
  }
};
</script>

<style>
</style>
