<template>
  <v-card>
    <v-card-text>
      {{JSON.stringify(league)}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "LeagueHomeTab",
  props: ["league"]
};
</script>

<style>
</style>
