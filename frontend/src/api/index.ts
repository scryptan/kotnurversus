import { CategoriesController } from "~/api/CategoriesController";
import { TourneysController } from "./TourneysController";
import { ChallengesController } from "~/api/ChallengesController";

export default {
  categories: new CategoriesController(),
  challenges: new ChallengesController(),
  tourneys: new TourneysController(),
};
