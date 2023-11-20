import { v4 as uuid } from "uuid";
import { MatchState } from "~/types/match";
import { Team } from "~/types/team";
import { TourneyMatch, TourneyType } from "~/types/tourney";

export const TOURNEY_TYPE_NAMES: Record<TourneyType, string> = {
  [TourneyType.Offline]: "Оффлайн",
  [TourneyType.Online]: "Онлайн",
};

export const createMatchesFromTeams = (teams: Team[]) => {
  const baseMatches = teams.reduce<TourneyMatch[]>((result, team, i) => {
    if (i % 2 === 0) {
      result.push({
        ...createEmptyMatch(uuid()),
        participants: [{ id: team.id, name: team.name }],
      });
    } else {
      result.at(-1)?.participants.push({ id: team.id, name: team.name });
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

const createMatches = (baseMatches: TourneyMatch[]): TourneyMatch[] => {
  if (baseMatches.length < 2) return baseMatches;

  const nextMatches = baseMatches.reduce<TourneyMatch[]>((result, match, i) => {
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

const createEmptyMatch = (matchId: string): TourneyMatch => ({
  id: matchId,
  nextMatchId: null,
  state: MatchState.Init,
  startTime: "",
  participants: [],
});
