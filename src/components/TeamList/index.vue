<template>
  <div>
    <!-- pagination.sync="pagination"
      item-key="id"
      loading="true"
      search="search" -->
    <v-card>
      <v-card-title>
        <!-- Team List
        <v-spacer /> -->
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          solo
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="teams"
        class="elevation-1"
        :search="search"
        :rows-per-page-items="[30, 60, {text: 'All', value: -1}]"
      >
        <template slot="items" slot-scope="props">
          <team-row :id="props.item.number ? props.item.number : props.item" />
          <!-- <router-link :to="{name: 'team', params: {id: props.item.id, tab: 'home' }}" tag="tr">
            <td>{{ props.item.number }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.league }}</td>
            <td>{{ props.item.organization }}</td>
          </router-link> -->
        </template>

        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>

    
  </div>
</template>

<script>
import TeamRow from "./TeamRow";

export default {
  name: "TeamsView",
  props: ["teams"],
  components: {
    TeamRow
  },
  data: () => ({
    search: "",
    teamsList: [],
    headers: [
      {
        text: "Number",
        value: "number"
      },
      {
        text: "Name",
        value: "name"
      },
      {
        text: "League",
        value: "league"
      }
      // {
      //   text: "Organization",
      //   value: "organization"
      // }
    ]
  })
};
</script>

<style>
</style>
