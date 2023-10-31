import { lazy } from "react";
import paths from "./paths";
import MainPage from "./MainPage";

const TourneysPage = lazy(() => import("./TourneysPage"));

export default {
  tourneys: {
    path: paths.tourneys.pathTemplate,
    Component: TourneysPage,
  },
  main: {
    path: paths.main.pathTemplate,
    Component: MainPage,
  },
};
