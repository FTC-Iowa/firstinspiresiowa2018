// , redirect: '/event/:eventId/home'
export default {
  path: "/event/:id",
  component: () => import("./EventPage"),
  props: true,
  children: [
    {
      path: "",
      component: () => import("./HomeTab"),
      name: "event"
    },
    // {
    //   path: 'schedule',
    //   component: HomePage
    // },
    {
      path: "teams",
      component: () => import("./TeamsTab"),
      name: "event-teams"
    },
    {
      path: "matches",
      component: () => import("./MatchesTab"),
      name: "event-matches"
    },
    {
      path: "rankings",
      component: () => import("./RankingsTab"),
      name: "event-rank"
    }
    // {
    //   path: 'inspections',
    //   component: HomePage
    // },
    // {
    //   path: 'awards',
    //   component: EventAwards
    // },
    // {
    //   path: 'twitter',
    //   component: EventTwitter
    // },
  ]
};
