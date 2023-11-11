export default {
  tourneys: {
    pathTemplate: "/tourneys",
    path: "/tourneys",
  },
  tourney: {
    pathTemplate: "/tourneys/:tourneyId",
    path: (tourneyId: number) => `/tourneys/${tourneyId}`,
  },
  match: {
    pathTemplate: "/match/:matchId",
    path: (matchId: number | string) => `/match/${matchId}`,
  },
  profile: {
    pathTemplate: "/profile",
    path: "/profile",
  },
  main: {
    pathTemplate: "/*",
    path: "/",
  },
};
