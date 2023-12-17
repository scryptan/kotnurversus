import { AuthController } from "./AuthController";
import { CategoriesController } from "./CategoriesController";
import { ChallengesController } from "./ChallengesController";
import { RoundsController } from "./RoundsController";
import { TourneysController } from "./TourneysController";

export default {
  auth: new AuthController(),
  categories: new CategoriesController(),
  challenges: new ChallengesController(),
  rounds: new RoundsController(),
  tourneys: new TourneysController(),
};
