<template>
  <div>
    <!-- <v-tabs-items :value="value" v-if="event">
      <v-tab-item
        v-for="tab in event.tabs"
        :key="tab"
        :id="tab"
      >
        <component :is="tabMap[tab]" :key="tab" :event="event"/>
      </v-tab-item>
    </v-tabs-items> -->
    <v-card v-if="event">
      <router-view :event="event" />
      <fab-menu v-if="event && event.tabs" :items="event.tabs" />
    </v-card>
    <div v-else class="text-xs-center">
      <v-progress-circular
        :size="200"
        :width="10"
        color="primary"
        indeterminate
        style="margin:50px"
      />
      <h2>Loading</h2>
    </div>

    <!-- {{event}} -->

  </div>
</template>

<script>
// import HomeTab from "./HomeTab";
// import AwardsTab from "./AwardsTab";
// import MatchesTab from "./MatchesTab";
// import TeamsTab from "./TeamsTab";
// import RankingsTab from "./RankingsTab";
import FabMenu from "@/components/FabMenu";

export default {
  name: "EventPage",
  props: ["value"],
  components: {
    FabMenu
  },
  data: () => ({
    // fab: false,
    // tabMap: {
    //   home: HomeTab,
    //   schedule: null,
    //   teams: TeamsTab,
    //   matches: MatchesTab,
    //   rankings: RankingsTab,
    //   inspections: null,
    //   awards: AwardsTab,
    //   twitter: null
    // },
    dbRefs: ["dbRef"]
  }),
  firestore() {},
  computed: {
    dbRef() {
      if (this.$route.params.id) {
        return "events/" + this.$route.params.id;
      } else {
        return null;
      }
    },

    event() {
      return this.db[this.dbRef];
    }
  },
  watch: {
    event: {
      immediate: true,
      handler: function(newValue) {
        // console.log("this", this)
        if (newValue && newValue.tabs) {
          this.$emit("setTabs", newValue.tabs);
        } else {
          this.$emit("setTabs", []);
        }
      }
    }
  },
  destroyed() {
    this.$emit("setTabs", []);
  },
  methods: {}
};
</script>
