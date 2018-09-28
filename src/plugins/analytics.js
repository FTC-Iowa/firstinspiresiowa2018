import Vue from "vue";
import VueAnalytics from "vue-ua";
import router from "../router";

Vue.use(VueAnalytics, {
  appName: "firstinspiresiowa",
  appVersion: "0.1.0",
  trackingId: "UA-111934327-2",
  vueRouter: router
});
