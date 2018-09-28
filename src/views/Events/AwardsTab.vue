<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <!-- {{event.val}}s -->
      <v-flex 
        xs12
        sm12
        md6
        lg4
        v-for="award in event.awards"
        :key="award"
      >
        <award-card 
          :id="award" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AwardCard from "@/components/AwardCard";

export default {
  name: "EventAwardsTab",
  props: ["event"],
  components: {
    AwardCard
  },
  mounted() {}
};
</script>

<style>
</style>
