import { Match, MatchTask } from "~/types/match";
import { TourneyMatch, TourneySpecification } from "~/types/tourney";

export const calcMatchName = (match: Match) => {
  const [firstName, secondName] = match.teams.map((t) => t.name);
  return `${firstName || "???"} vs ${secondName || "???"}`;
};

export const createArrayFromMatchTask = (task: MatchTask) => {
  const array: Array<{ name: string; text: string }> = [];

  if (task.scenario) {
    array.push({ name: "Бизнес сценарий", text: task.scenario });
  }
  if (task.description) {
    array.push({ name: "Описание", text: task.description });
  }
  if (task.generalRequirements) {
    array.push({
      name: "Общие требования к архитектуре",
      text: task.generalRequirements,
    });
  }

  return array;
};

export const addSpecificationToRound =
  (specifications: TourneySpecification[]) =>
  (match: TourneyMatch, index: number): TourneyMatch => {
    const specificationTitle = specifications[index]?.title || null;
    return { ...match, badgeValue: index + 1, specificationTitle };
  };
