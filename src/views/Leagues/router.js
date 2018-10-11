export default {
  path: "/league/:id/",
  component: () => import("./LeaguePage"),
  props: true,
  children: [
    {
      path: "",
      component: () => import("./HomeTab"),
      name: "league"
    },
    {
      path: "teams",
      component: () => import("./TeamsTab"),
      name: "league-teams"
    },
    {
      path: "events",
      component: () => import("./EventsTab"),
      name: "league-events"
    },
    {
      path: "rankings",
      component: () => import("./RankingsTab"),
      name: "league-rankings"
    }
  ]
};
