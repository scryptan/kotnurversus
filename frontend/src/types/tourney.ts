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
  name: string;
  nextMatchId: number | null;
  startTime: string;
  state: TourneyMatchState;
  participants: TourneyTeam[];
};

export enum TourneyMatchState {
  Scheduled = "SCHEDULED",
  Played = "PLAYED",
  WalkOver = "WALK_OVER",
  Done = "DONE",
}

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
