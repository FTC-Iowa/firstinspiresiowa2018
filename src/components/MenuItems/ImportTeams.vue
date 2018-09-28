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
      Import Teams
    </span>
    <v-card>
      <v-card-title>
        <span class="headline">Import Teams</span>
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="value"
          solo
          label="JSON Data"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" flat @click.native="cancel">Cancel</v-btn>
        <v-btn color="secondary" @click.native="parseTeams">Import</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ImportTeams",
  data: () => ({
    visible: false,
    value: ""
  }),
  watch: {},
  methods: {
    show() {
      this.visible = true;
    },
    cancel() {
      this.visible = false;
    },
    finished() {
      this.visible = false;
    },

    parseTeams() {
      console.log("parse teams");
      var data = JSON.parse(this.value);
      console.log(data);

      var importTeams = this.$functions.httpsCallable("importTeams");
      importTeams(data).then(result => {
        console.log("Import Teams Results:", result);
        this.finished();
      });
    }
  }
};
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
