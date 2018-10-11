export default {
  path: "/team/:id/",
  component: () => import("./TeamPage"),
  props: true,
  children: [
    {
      path: "",
      component: () => import("./HomeTab"),
      name: "team"
    },
    {
      path: "events",
      component: () => import("./EventTab"),
      name: "team-events"
    },
    {
      path: "matches",
      component: () => import("./MatchesTab"),
      name: "team-matches"
    },
    {
      path: "awards",
      component: () => import("./AwardsTab"),
      name: "team-awards"
    }
  ]
};
