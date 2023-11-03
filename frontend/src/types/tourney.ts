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
};

export type TourneyMatch = {
  id: number;
  name: string;
  nextMatchId: number | null;
  startTime: string;
  state: TourneyMatchState;
  participants: TourneyParticipant[];
};

export enum TourneyMatchState {
  Scheduled = "SCHEDULED",
  Played = "PLAYED",
  WalkOver = "WALK_OVER",
  Done = "DONE",
}

export type TourneyParticipant = {
  id: string;
  name: string;
  resultText?: string;
  isWinner?: boolean;
  status?: TourneyMatchState;
};
