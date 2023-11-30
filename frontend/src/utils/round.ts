import { CreateRound, Round } from "~/types/round";
import {
  TourneyRound,
  TourneyRoundState,
  TourneySpecification,
  TourneyTeam,
} from "~/types/tourney";

export const castToCreateRound =
  (tourneyId: string) =>
  (round: TourneyRound, index: number): CreateRound => {
    if (!round.specification) {
      throw new Error("Темы бизнес-сценариев указаны не для всех раундов");
    }

    return {
      gameId: tourneyId,
      nextRoundId: round.nextMatchId,
      participants: round.participants.map((p, i) => ({
        teamId: p.id,
        challenges: [],
        isWinner: false,
        points: 0,
        order: i + 1,
      })),
      specification: round.specification,
      order: index + 1,
    };
  };

export const castToTourneyRound =
  (teams: TourneyTeam[], isOrganizer: boolean) =>
  (round: Round): TourneyRound => {
    const state = round.currentState?.state as TourneyRoundState | undefined;
    const initState =
      isOrganizer && round.participants.length > 1
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

  array.push({ name: "Бизнес сценарий", text: specification.title });
  array.push({
    name: "Описание",
    text: specification.businessDescription || "Информация не указана",
  });
  array.push({
    name: "Общие требования к архитектуре",
    text: specification.techDescription || "Информация не указана",
  });

  return array;
};
