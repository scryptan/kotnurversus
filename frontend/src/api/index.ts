import { CategoriesController } from "~/api/CategoriesController";
import { ChallengesController } from "~/api/ChallengesController";
import { RoundsController } from "~/api/RoundsController";
import { TourneysController } from "./TourneysController";

export default {
  categories: new CategoriesController(),
  challenges: new ChallengesController(),
  rounds: new RoundsController(),
  tourneys: new TourneysController(),
};
