<template>
  <v-card>
    <v-card-title>
      League List
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="leagues"
      class="elevation-1"
      :search="search"
      :rows-per-page-items="[10, 25, 50, {text: 'All', value: -1}]"
      hide-actions
    >
      <template slot="items" slot-scope="props">
        <router-link :to="{name: 'league', params: {id: props.item.id, tab: 'home' }}" tag="tr">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.region }}</td>
        </router-link>
      </template>

      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "LeagueList",
  data: () => ({
    search: "",
    leagues: [],
    headers: [
      { text: "Name", value: "name" },
      { text: "Location", value: "region" }
    ]
  }),
  firestore() {
    return {
      leagues: this.$db.collection("leagues")
    };
  }
};
</script>

<style>
</style>
