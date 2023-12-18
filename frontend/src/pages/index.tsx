import { lazy } from "react";
import MainPage from "./MainPage";
import paths from "./paths";

const AdminPage = lazy(() => import("./AdminPage"));
const ChallengesPage = lazy(() => import("./ChallengesPage"));
const TourneysPage = lazy(() => import("./TourneysPage"));
const CreateTourneyPage = lazy(() => import("./CreateTourneyPage"));
const EditTourneyPage = lazy(() => import("./EditTourneyPage"));
const TourneyPage = lazy(() => import("./TourneyPage"));
const RoundPage = lazy(() => import("./RoundPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));

export default {
  admin: {
    path: paths.admin.pathTemplate,
    Component: AdminPage,
  },
  challenges: {
    path: paths.challenges.pathTemplate,
    Component: ChallengesPage,
  },
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
  round: {
    path: paths.round.pathTemplate,
    Component: RoundPage,
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
