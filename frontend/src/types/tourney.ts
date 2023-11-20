import { MatchState } from "~/types/match";

export type Tourney = {
  id: number;
  name: string;
  startDate: Date;
  type: TourneyType;
};

export enum TourneyType {
  Offline = "offline",
  Online = "online",
}

export type TourneyFullInfo = Tourney & {
  organizer: string;
  location: string;
  matches: TourneyMatch[];
  artifacts: TourneyArtifact[];
};

export type TourneyMatch = {
  id: string;
  nextMatchId: string | null;
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

export type TourneyScenario = {
  id: string;
  name: string;
  description?: string | undefined;
  requirements?: string | undefined;
};

export type TourneyArtifact = {
  name: string;
  link: string;
};
