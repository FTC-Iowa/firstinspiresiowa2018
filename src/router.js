import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

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
    {
      path: "/team/:id",
      redirect: () => {
        return "/team/:id/home";
      }
    },
    {
      path: "/team/:id/:tab",
      name: "team",
      component: () => import("./views/Teams/TeamPage")
    },
    {
      path: "/event",
      name: "events",
      component: () => import("./views/Events")
    },
    {
      path: "/event/:id",
      redirect: () => {
        return "/event/:id/home";
      }
    },
    {
      path: "/event/:id/:tab",
      name: "event",
      component: () => import("./views/Events/EventPage")
    },
    {
      path: "/league",
      name: "leagues",
      component: () => import("./views/Leagues")
    },
    {
      path: "/league/:id",
      redirect: () => {
        return "/league/:id/home";
      }
    },
    {
      path: "/league/:id/:tab",
      name: "league",
      component: () => import("./views/Leagues/LeaguePage")
    }
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
