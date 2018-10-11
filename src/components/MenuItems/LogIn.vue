<template>
  <v-dialog
    v-if="!$store.getters.authIsLoggedIn"
    v-model="visible" 
    :overlay="false"
    max-width="600px"
    transition="dialog-transition"
    scrollable
  >
    <span slot="activator">
      Log In
    </span>
    <v-card>
      <v-card-title>
        <span class="headline">Login</span>
      </v-card-title>
      <v-card-text>
        <div id="firebaseui-auth-container" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" flat @click.native="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <span v-else @click="logout">
    Log Out
  </span>
</template>

<script>
// import firebase from 'firebase'
// import firebaseui from "firebaseui";
// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebaseui/dist/firebaseui.css";

export default {
  name: "LoginMenu",
  data: () => ({
    visible: false,
    ui: null
  }),
  methods: {
    cancel() {
      this.visible = false;
    },
    logout() {
      console.log("logout");
      this.$auth.signOut();
    },
    init() {
      // if (this.ui) delete this.ui;
      // var uiConfig = {
      //   signInOptions: this.$auth.signInOptions,
      //   signInFlow: "popup",
      //   callbacks: {
      //     signInSuccessWithAuthResult: authResult => {
      //       console.log("Sign In Success: ", authResult);
      //       this.visible = false;
      //       return false; // don't redirect
      //     },
      //     signInFailure: error => {
      //       console.error("Sign In Error: ", error);
      //       return false;
      //     }
      //   }
      // };
      // this.ui = new firebaseui.auth.AuthUI(this.$auth);
      // this.ui.start("#firebaseui-auth-container", uiConfig);
    }
  },
  watch: {
    // visible(val) {
    //   console.log('change...')
    //   if(val) {
    //     console.log('set visible...')
    //     this.visible = false;
    //   }
    // }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    // delete this.ui;
  }
};
</script>

<style lang="scss">
</style>
