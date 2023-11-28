export default {
  challenges: {
    pathTemplate: "/challenges",
    path: "/challenges",
  },
  tourneys: {
    pathTemplate: "/tourneys",
    path: "/tourneys",
  },
  createTourney: {
    pathTemplate: "/tourneys/create",
    path: "/tourneys/create",
  },
  editTourney: {
    pathTemplate: "/tourneys/edit/:tourneyId",
    path: (tourneyId: string) => `/tourneys/edit/${tourneyId}`,
  },
  tourney: {
    pathTemplate: "/tourneys/:tourneyId",
    path: (tourneyId: string) => `/tourneys/${tourneyId}`,
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
