export default {
  tourneys: {
    pathTemplate: "/tourneys",
    path: "/tourneys",
  },
  tourney: {
    pathTemplate: "/tourneys/:tourneyId",
    path: (tourneyId: number) => `/tourneys/${tourneyId}`,
  },
  main: {
    pathTemplate: "/*",
    path: "/",
  },
};
