import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

import Team from "./views/Teams/router";
import Event from "./views/Events/router";
import League from "./views/Leagues/router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: { name: "home" }
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/team",
      name: "teams",
      component: () => import("./views/Teams")
    },
    Team,
    {
      path: "/event",
      name: "events",
      component: () => import("./views/Events")
    },
    Event,
    {
      path: "/league",
      name: "leagues",
      component: () => import("./views/Leagues")
    },
    League
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
