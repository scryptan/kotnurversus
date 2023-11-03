import { lazy } from "react";
import paths from "./paths";
import MainPage from "./MainPage";

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
  main: {
    path: paths.main.pathTemplate,
    Component: MainPage,
  },
};
