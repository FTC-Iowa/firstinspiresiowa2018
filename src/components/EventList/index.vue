<template>
  <v-card>
    <v-card-title>
      <!-- Event List
      <v-spacer /> -->
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
        solo
      />
    </v-card-title>

    <database-doc 
      v-for="(event, i) in events" 
      :key="event" 
      collection="events" 
      :id="event" 
      v-model="eventList[i]"
    />

    <v-data-table
      :headers="headers"
      :items="eventList"
      class="elevation-1"
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="[10, 25, 50, {text: 'All', value: -1}]"
    >
      <template slot="items" slot-scope="props">
        <event-row v-if="props.item" :id="props.item.id" />
      </template>

      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
import DatabaseDoc from "@/components/DatabaseDoc";
import EventRow from "./EventRow";
export default {
  name: "EventList",
  props: ["events"],
  components: {
    DatabaseDoc,
    EventRow
  },
  data: () => ({
    search: "",
    eventList: [],
    headers: [
      { text: "Type", value: "type" },
      { text: "Name", value: "name" },
      { text: "Date", value: "date.seconds" },
      { text: "Location", value: "location" }
    ],
    pagination: {
      sortBy: "date.seconds",
      descending: true
    }
  })
};
</script>

<style>
</style>
