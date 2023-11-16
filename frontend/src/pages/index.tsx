import { lazy } from "react";
import paths from "./paths";
import MainPage from "./MainPage";
import { Spacer } from "@chakra-ui/react";

const TourneysPage = lazy(() => import("./TourneysPage"));
const CreateTourneyPage = lazy(() => import("./CreateTourneyPage"));
const TourneyPage = lazy(() => import("./TourneyPage"));
const MatchPage = lazy(() => import("./MatchPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));

export default {
  tourneys: {
    path: paths.tourneys.pathTemplate,
    Component: TourneysPage,
  },
  createTourney: {
    path: paths.createTourney.pathTemplate,
    Component: CreateTourneyPage,
  },
  editTourney: {
    path: paths.editTourney.pathTemplate,
    Component: Spacer,
  },
  tourney: {
    path: paths.tourney.pathTemplate,
    Component: TourneyPage,
  },
  match: {
    path: paths.match.pathTemplate,
    Component: MatchPage,
  },
  profile: {
    path: paths.profile.pathTemplate,
    Component: ProfilePage,
  },
  main: {
    path: paths.main.pathTemplate,
    Component: MainPage,
  },
};
