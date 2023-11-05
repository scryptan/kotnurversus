import { MatchState } from "~/types/match";

export type Tourney = {
  id: number;
  name: string;
  startDate: Date;
  type: string;
};

export type TourneyFullInfo = Tourney & {
  organizer: string;
  location: string;
  matches: TourneyMatch[];
  artifacts: TourneyArtifact[];
};

export type TourneyMatch = {
  id: number;
  nextMatchId: number | null;
  startTime: string;
  state: MatchState;
  participants: TourneyTeam[];
};

export type TourneyTeam = {
  id: string;
  name: string;
  resultText?: string;
  isWinner?: boolean;
};

export type TourneyArtifact = {
  name: string;
  link: string;
};
