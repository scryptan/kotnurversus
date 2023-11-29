import { v4 as uuid } from "uuid";
import {
  TourneyRound,
  TourneyRoundState,
  TourneyTeam,
  TourneyType,
} from "~/types/tourney";

export const TOURNEY_TYPE_NAMES: Record<TourneyType, string> = {
  [TourneyType.Offline]: "Оффлайн",
  [TourneyType.Online]: "Онлайн",
};

export const createMatchesFromTeams = (teams: TourneyTeam[]) => {
  const baseMatches = teams.reduce<TourneyRound[]>((result, team, i) => {
    if (i % 2 === 0) {
      result.push({
        ...createEmptyMatch(uuid()),
        participants: [{ id: team.id, name: team.title }],
      });
    } else {
      result.at(-1)?.participants.push({ id: team.id, name: team.title });
    }
    return result;
  }, []);

  [...Array(calcMissingMatchesCount(teams.length))].forEach((_) =>
    baseMatches.push(createEmptyMatch(uuid()))
  );

  return createMatches(baseMatches);
};

const calcMissingMatchesCount = (teamsCount: number) => {
  let minTeams = 2;
  while (minTeams < teamsCount) {
    minTeams *= 2;
  }
  return Math.floor((minTeams - teamsCount) / 2);
};

const createMatches = (baseMatches: TourneyRound[]): TourneyRound[] => {
  if (baseMatches.length < 2) return baseMatches;

  const nextMatches = baseMatches.reduce<TourneyRound[]>((result, match, i) => {
    if (i % 2 === 0) {
      const matchId = uuid();
      match.nextMatchId = matchId;
      result.push(createEmptyMatch(matchId));
    } else {
      match.nextMatchId = result.at(-1)?.id || null;
    }

    return result;
  }, []);

  return [...baseMatches, ...createMatches(nextMatches)];
};

const createEmptyMatch = (matchId: string): TourneyRound => ({
  id: matchId,
  nextMatchId: null,
  state: TourneyRoundState.Init,
  startTime: "",
  participants: [],
});
