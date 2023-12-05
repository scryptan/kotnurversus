import { CreateRound, Round } from "~/types/round";
import {
  Tourney,
  TourneyRound,
  TourneyRoundState,
  TourneySpecification,
  TourneyTeam,
} from "~/types/tourney";
import { isDefined } from "~/utils";

export const castToCreateRound =
  (tourney: Tourney) =>
  (round: TourneyRound, index: number): CreateRound => {
    if (!round.specification) {
      throw new Error("Темы бизнес-сценариев указаны не для всех раундов");
    }

    return {
      gameId: tourney.id,
      nextRoundId: round.nextMatchId,
      participants: round.participants.map((p, i) => ({
        teamId: p.id,
        challenges: [],
        isWinner: false,
        points: 0,
        order: i + 1,
      })),
      specification: round.specification,
      settings: tourney.settings,
      order: index + 1,
    };
  };

export const castToTourneyRound =
  (teams: TourneyTeam[]) =>
  (round: Round): TourneyRound => {
    const state = round.currentState?.state as TourneyRoundState | undefined;
    const initState =
      round.participants.length > 1
        ? TourneyRoundState.InitReady
        : TourneyRoundState.Init;

    return {
      startTime: "",
      id: round.id,
      nextMatchId: round.nextRoundId || null,
      state: state || initState,
      participants: round.participants.map((p) => {
        const team = teams.find((t) => t.id === p.teamId);
        return {
          id: p.teamId,
          name: team?.title || `Команда ${p.teamId}`,
          isWinner: p.isWinner,
          resultText: `${p.points}`,
        };
      }),
      ...(state ? { specification: round.specification } : {}),
    };
  };

export const calcRoundName = (match: Round, teams: TourneyTeam[]) => {
  const [firstName, secondName] = match.participants.map(
    (p) => teams.find((team) => team.id === p.teamId)?.title
  );

  return `${firstName || "???"} vs ${secondName || "???"}`;
};

export const createArrayFromSpecification = (
  specification: TourneySpecification
) => {
  const array: Array<{ name: string; text: string }> = [];

  array.push({
    name: "Бизнес сценарий",
    text: [specification.title, specification.businessDescription]
      .filter(isDefined)
      .join("\n"),
  });
  array.push({
    name: "Общие требования к архитектуре",
    text: specification.techDescription || "Информация не указана",
  });

  return array;
};
