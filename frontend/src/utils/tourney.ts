import { TourneyType } from "~/types/tourney";

export const TOURNEY_TYPE_NAMES: Record<TourneyType, string> = {
  [TourneyType.Offline]: "Оффлайн",
  [TourneyType.Online]: "Онлайн",
};
