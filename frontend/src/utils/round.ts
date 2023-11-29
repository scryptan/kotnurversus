import { CreateRound, Round } from "~/types/round";
import { TourneyRound, TourneyRoundState, TourneyTeam } from "~/types/tourney";

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
  (round: Round): TourneyRound => ({
    startTime: "",
    id: round.id,
    nextMatchId: round.nextRoundId || null,
    // TODO: прокинуть стейт из раунда
    state:
      isOrganizer && round.participants.length > 1
        ? TourneyRoundState.InitReady
        : TourneyRoundState.Init,
    participants: round.participants.map((p) => {
      const team = teams.find((t) => t.id === p.teamId);
      return {
        id: p.teamId,
        name: team?.title || `Команда ${p.teamId}`,
        isWinner: p.isWinner,
        resultText: `${p.points}`,
      };
    }),
  });
