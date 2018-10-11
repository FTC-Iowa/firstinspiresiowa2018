<template>
  <v-card>
    <v-card-text>
      <!-- {{JSON.stringify(event)}} -->
      Event {{event.name}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "EventHomeTab",
  props: ["event"]
};
</script>

<style>
</style>
