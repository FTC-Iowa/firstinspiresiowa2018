<template>
  <v-card>
    <v-card-title>
      Event List
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
      :items="eventList"
      class="elevation-1"
      :search="search"
      :rows-per-page-items="[10, 25, 50, {text: 'All', value: -1}]"
    >
      <template slot="items" slot-scope="props">
        <router-link :to="{name: 'event', params: {id: props.item.id, tab: 'home' }}" tag="tr">
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.name }}</td>
          <td><date-format :time="props.item.date" /></td>
          <td>{{ props.item.location }}</td>
        </router-link>
      </template>

      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
import DateFormat from "@/components/DateFormat";

export default {
  name: "EventsView",
  components: {
    DateFormat
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
    firestoreRefs: []
  }),
  mounted() {
    var ref = this.$db.collection("events");
    var observer = ref.onSnapshot(snapshot => {
      var list = [];
      snapshot.docs.forEach(doc => {
        var d = doc.data();
        d.id = doc.id;
        list.push(d);
      });
      this.eventList = list;
    });
    this.firestoreRefs.push(observer);
  },
  beforeDestroy() {
    this.firestoreRefs.forEach(ref => {
      ref();
    });
  }
};
</script>

<style>
</style>
