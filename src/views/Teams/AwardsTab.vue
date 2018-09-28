<template>
  <v-container grid-list-lg v-if="team">
    <v-layout row wrap v-if="team.awards">
      <v-flex 
        xs12
        sm12
        md6
        lg4
        v-for="award in team.awards"
        :key="award.id"
      >
        <award-card 
          :award="award" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AwardCard from "@/components/AwardCard";

export default {
  name: "TeamAwardsTab",
  props: ["team"],
  components: {
    AwardCard
  }
};
</script>

<style>
</style>
