<template>
  <v-card tile v-if="awardData">
    <v-card-title >
      <div>
        <h3 class="headline mb-0">{{awardData.name}} Award</h3>
        <div>{{awardData.event.name}}</div>
      </div>
    </v-card-title>

    <v-card-text>
      <v-layout row>
        <v-flex
          :xs6="imgurl !== null"
        >
          <dl v-if="awardData.ordered">
            <div v-if="awardData.teams[0]">
              <dt>1st:</dt>
              <router-link 
                tag="dd"
                :to="'/team/' + awardData.teams[0].id + '/home'"
              >
                {{awardData.teams[0].id}} - {{awardData.teams[0].name}}
              </router-link>
            </div>
            <div v-if="awardData.teams[1]">
              <dt>2nd:</dt>
              <router-link 
                tag="dd"
                :to="'/team/' + awardData.teams[1].id + '/home'"
              >
                {{awardData.teams[1].id}} - {{awardData.teams[1].name}}
              </router-link>
            </div>
            <div v-if="awardData.teams[2]">
              <dt>3rd:</dt>
              <router-link 
                tag="dd"
                :to="'/team/' + awardData.teams[2].id + '/home'"
              >
                {{awardData.teams[2].id}} - {{awardData.teams[2].name}}
              </router-link>
            </div>
            <div v-if="awardData.teams[3]">
              <dt>4th:</dt>
              <router-link 
                tag="dd"
                :to="'/team/' + awardData.teams[3].id + '/home'"
              >
                {{awardData.teams[3].id}} - {{awardData.teams[3].name}}
              </router-link>
            </div>
          </dl>
          <dl v-else>
            <div v-if="awardData.teams[0]">
              <dt>Winner:</dt>
              <dd>{{awardData.teams[0].id}} - {{awardData.teams[0].name}}</dd>
            </div>
            <div v-if="awardData.teams[1]">
              <dt>Finalists:</dt>
              <dd>{{awardData.teams[1].id}} - {{awardData.teams[1].name}}</dd>
              <dd v-if="awardData.teams[2]">{{awardData.teams[2].id}} - {{awardData.teams[2].name}}</dd>
              <dd v-if="awardData.teams[3]">{{awardData.teams[3].id}} - {{awardData.teams[3].name}}</dd>
            </div>
          </dl>
        </v-flex>
        <v-flex
          v-if="imgurl"
        >
          <v-img 
            :src="imgurl"
            contain
            max-height=185px
          />
        </v-flex>
      </v-layout>
    </v-card-text>

    <!-- {{award}} -->
  </v-card>
</template>

<script>
export default {
  name: "AwardCard",
  props: ["award", "id"],
  data: () => ({
    imgurl: null,
    doc: null,
    firestoreRefs: [],
    watcherRef: null
  }),
  computed: {
    awardData() {
      if (this.award && typeof this.award === "object") {
        return this.award;
      } else {
        return this.doc;
      }
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(newVal) {
        this.firestoreStopWatch(this.ref);
        if (newVal) {
          this.firestoreGetDoc("awards", newVal, "doc");
        }
      }
    },
    awardData: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.picture) {
          this.$storage
            .ref(newVal.picture)
            .getDownloadURL()
            .then(url => (this.imgurl = url));
        } else {
          this.imgurl = null;
        }
      }
    }
  },
  methods: {
    firestoreStopWatch(watcher) {
      if (watcher) {
        watcher();
      }
    },
    firestoreGetDoc(collection, doc, dest) {
      var ref = this.$db.collection(collection).doc(doc);
      var observer = ref.onSnapshot(snapshot => {
        var d = snapshot.data();
        d.id = snapshot.id;
        this[dest] = d;
      });
      return observer;
    }
  },
  mounted() {
    // var ref = this.$db.collection("awards").doc(this.id);
    // var observer = ref.onSnapshot(snapshot => {
    //   var d = snapshot.data();
    //   d.id = snapshot.id;
    //   this.doc = d;
    // })
    // this.firestoreRefs.push(observer)
  },
  beforeDestroy() {
    // this.firestoreRefs.forEach(ref => {
    //   ref();
    // })
    this.firestoreStopWatch(this.watcherRef);
  }
};
</script>

<style scoped lang="scss">
.v-card__text {
  padding-top: 0px;
}

dl {
  dt {
    font-weight: bold;
  }
  dd {
    padding-left: 20px;
  }
}
</style>
