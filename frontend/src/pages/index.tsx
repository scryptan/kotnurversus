import { lazy } from "react";
import MainPage from "./MainPage";
import paths from "./paths";

const TourneysPage = lazy(() => import("./TourneysPage"));
const CreateTourneyPage = lazy(() => import("./CreateTourneyPage"));
const EditTourneyPage = lazy(() => import("./EditTourneyPage"));
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
    Component: EditTourneyPage,
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
