import { lazy } from "react";
import paths from "./paths";
import MainPage from "./MainPage";
import MatchPage from "~/pages/MatchPage";

const TourneysPage = lazy(() => import("./TourneysPage"));
const TourneyPage = lazy(() => import("./TourneyPage"));

export default {
  tourneys: {
    path: paths.tourneys.pathTemplate,
    Component: TourneysPage,
  },
  tourney: {
    path: paths.tourney.pathTemplate,
    Component: TourneyPage,
  },
  match: {
    path: paths.match.pathTemplate,
    Component: MatchPage,
  },
  main: {
    path: paths.main.pathTemplate,
    Component: MainPage,
  },
};
