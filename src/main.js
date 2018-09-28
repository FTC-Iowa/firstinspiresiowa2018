import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/analytics";
import "./registerServiceWorker";

import Firebase from "./plugins/firebase";

Vue.use(Firebase);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch("AUTH_INIT", this.$auth);
  }
}).$mount("#app");
