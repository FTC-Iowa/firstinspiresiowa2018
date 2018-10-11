<template>
  <v-dialog
    v-model="visible"
    persistent 
    :overlay="false"
    max-width="600px"
    transition="dialog-transition"
    scrollable
  >
    <span slot="activator">
      Upload Event
    </span>
    <v-card>
      <v-card-title>
        <span class="headline">Upload New Event: {{eventName}}</span>
      </v-card-title>
      <v-card-text>
        <!-- <v-btn color="success" @click.native="parseEvent">text</v-btn> -->
        <v-stepper v-model="step" vertical>
          <v-stepper-step step="1" :complete="step > 1">
            Add Event Information
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card class="mb-5">
              <v-card-text>
                <v-form v-model="formValid">
                  <v-container>
                    <v-layout row wrap>
                      <!-- Event Type -->
                      <v-flex xs12>
                        <v-select
                          :items="eventTypes"
                          :rules="rules.nonEmpty"
                          v-model="form.type"
                          label="Event Type"
                        />
                      </v-flex>

                      <!-- League -->
                      <v-flex xs8 v-if="form.type === 'LeagueMeet'">
                        <v-select
                          :items="leagues"
                          :rules="rules.nonEmpty"
                          v-model="form.league"
                          label="League"
                          item-value="id"
                          item-text="name"
                        />
                      </v-flex>

                      <!-- Meet Number -->
                      <v-flex xs4 v-if="form.type === 'LeagueMeet'">
                        <v-text-field
                          type="number"
                          label="Meet Number"
                          :rules="rules.nonEmpty"
                          v-model="form.number"
                          v-if="form.type === 'LeagueMeet'"
                          min=0
                          max=10
                          step=1
                        />
                      </v-flex>

                      <!-- Date -->
                      <v-flex xs12>
                        <v-menu 
                          v-model="dateMenu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                        >
                          <v-text-field
                            slot="activator"
                            v-model="form.date"
                            persistent-hint
                            prepend-icon="event"
                            label="Event Date"
                            :rules="rules.nonEmpty"
                          />
                            <!-- @blur="date = parseDate(dateFormatted)"/ -->
                          <v-date-picker v-model="form.date" no-title @input="dateMenu = false" />
                        </v-menu>
                      </v-flex>

                      <!-- Event Name -->
                      <v-flex xs12>
                        <v-text-field
                          label="Event Name"
                          :rules="rules.nonEmpty"
                          v-model="form.name"
                          :disabled="form.type === 'LeagueMeet'"
                        />
                      </v-flex>

                      <!-- Location -->
                      <v-flex xs12>
                        <v-text-field
                          label="Event Location"
                          :rules="rules.nonEmpty"
                          v-model="form.location"
                        />
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" flat @click.native="cancel">Cancel</v-btn>
                <v-btn color="secondary" @click.native="finishStep1" :disabled="!formValid">Continue</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-step step="2" :complete="step > 2">
            Upload Event Data
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card class="mb-5">
              <v-card-text>

                <v-text-field
                  label="Select Event Data"
                  :rules="rules.nonEmpty"
                  v-model="fileName"
                  :loading="uploading"
                  @click.native="selectFile"
                >
                  <v-progress-linear 
                    slot="progress"
                    :value="uploadProgress"
                    height="7"
                  />
                </v-text-field>

                <input
                  type="file"
                  accept=".db"
                  :multiple="false"
                  ref="uploader"
                  @change="detectFiles($event)"
                />
              </v-card-text>              
              <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" flat @click.native="cancel">Cancel</v-btn>
                <v-btn color="secondary" @click.native="upload" :disabled="!file || uploading">Continue</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-step step="3" :complete="step > 3">
            Process Event
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-card class="mb-5">
              <v-card-text>
                <div class="text-xs-center">
                  Processing event data...
                </div>
                <div class="text-xs-center">
                  <v-progress-circular 
                    :size="70"
                    :width="7"
                    indeterminate
                    color="secondary"
                  />  
                </div>
              </v-card-text>
            </v-card>
          </v-stepper-content>


          <v-stepper-step step="4" :complete="step > 4">
            Finished
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-card>
              <v-card-text>
                Event successfully uploaded.  Parsing not yet supported.
              </v-card-text>
              
              <v-card-actions>
                <v-spacer />
                <!-- <v-btn color="secondary" flat @click.native="cancel">Cancel</v-btn> -->
                <v-btn color="secondary" @click.native="finished">Finished</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
const ShortId = require("shortid");

export default {
  name: "UploadEvent",
  data: () => ({
    visible: false,
    step: 1,
    id: "XaqzYvsBY", //null,
    eventName: "",
    eventTypes: ["LeagueMeet"],
    form: {
      type: "LeagueMeet", //null,
      league: null,
      date: null, //null,
      number: 1, //null,
      name: null,
      location: null
    },
    formValid: false,
    rules: {
      nonEmpty: [v => !!v || "Field is required"]
    },
    dateMenu: false,
    date: null,
    dateFormated: null,

    uploading: false,
    uploadFinished: false,
    uploadProgress: 0,
    fileName: null,
    uploadTask: null,
    file: null,
    serverResult: "",

    dbRefs: ["leaguesRef"],
    leaguesRef: "admin/leagues"
  }),
  computed: {
    leagues() {
      var doc = this.db[this.leaguesRef];
      return doc ? doc.leagues : [];
    }
  },
  watch: {
    "form.league": {
      handler() {
        this.updateName();
      }
    },
    "form.number": {
      handler() {
        this.updateName();
      }
    },
    uploadTask: {
      handler() {
        console.log("uploadTask chagned");
        this.uploadTask.on(
          "state_changed",
          sp => {
            this.uploadProgress = Math.floor(
              (sp.bytesTransferred / sp.totalBytes) * 100
            );
          },
          error => {
            console.error("upload error: ", error);
          },
          () => {
            console.log("Finished Uploading");
            this.file = null;
            this.fileName = null;
            this.uploading = false;
            this.uploadFinished = true;
            this.step = 3;
            this.parseEvent();
          }
        );
      }
    }
  },
  methods: {
    show() {
      // this.firestoreGetCollection("leagues");
      this.visible = true;
    },
    cancel() {
      this.visible = false;
      this.step = 1;
      // this.firestoreStopAllWatcers();
    },
    finished() {
      this.visible = false;
      this.step = 1;
      // this.firestoreStopAllWatcers();
    },

    updateName() {
      if (
        this.form.type === "LeagueMeet" &&
        this.form.league &&
        this.form.number
      ) {
        var name = this.leagues.filter(l => l.id == this.form.league)[0].name;
        this.form.name = name + " Meet " + this.form.number;
      }
    },

    selectFile() {
      this.$refs.uploader.click();
    },

    detectFiles(event) {
      var fileList = event.target.files || event.dataTransfer.files;
      var file = fileList[0];
      if (file) {
        this.file = file;
        this.fileName = file.name;
      } else {
        this.file = null;
        this.fileName = "";
      }
      console.log(fileList);
    },

    upload() {
      this.uploadProgress = 0;
      this.uploading = true;

      this.id = ShortId.generate();
      this.uploadTask = this.$storage
        .ref("event-data/" + this.id + ".zip")
        .put(this.file); // todo, change file name
    },

    finishStep1() {
      this.eventName = this.form.name;

      this.step = 2;
    },

    parseEvent() {
      console.log("parse event");
      var parseEvent = this.$functions.httpsCallable("uploadEvent");

      var eventData = this.form;
      console.log("league:", eventData.league);
      eventData.id = this.id;

      parseEvent(eventData).then(result => {
        console.log("result: ", result);
        this.serverResult = result.message;
        this.step = 4;
      });
    }

    // firestoreStopWatch(watcher) {
    //   if (watcher) {
    //     watcher();
    //   }
    // },

    // firestoreStopAllWatcers() {
    //   this.firestoreWatchers.forEach(observer => {
    //     this.firestoreStopWatch(observer);
    //   });
    // },

    // firestoreGetCollection(collection) {
    //   var ref = this.$db.collection(collection);
    //   var observer = ref.onSnapshot(snapshot => {
    //     this.leagueListDocs = [];
    //     var leagueListTmp = [];
    //     snapshot.forEach(doc => {
    //       var data = doc.data();
    //       data.id = doc.id;
    //       this.leagueListDocs.push(data);
    //       leagueListTmp.push(data.name);
    //     });
    //     this.leagueList = leagueListTmp.sort();
    //   });
    //   this.firestoreWatchers.push(observer);
    // }
  }
};
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
