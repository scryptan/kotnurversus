import { TourneySettings, TourneySpecification } from "~/types/tourney";

export type Round = {
  id: string;
  description?: string;
  nextRoundId?: string;
  gameId: string;
  settings: TourneySettings;
  specification: TourneySpecification;
  participants: RoundParticipant[];
  artifacts: unknown[];
  history: RoundStateData[];
  winnerId?: string;
  currentState?: RoundStateData;
  order: number;
};

export type CreateRound = {
  gameId: string;
  nextRoundId?: string | null;
  participants: RoundParticipant[];
  specification: TourneySpecification;
  settings: TourneySettings;
  order: number;
};

export type FinishRound = {
  marks: RoundMark[];
};

export type RoundStateData = {
  state?: RoundState;
  value?: {
    currentState?: RoundState;
    start?: Date;
    teamId?: string;
  };
  order: number;
};

export enum RoundState {
  Prepare = "prepare",
  Presentation = "presentation",
  Defense = "defense",
  Mark = "mark",
  Complete = "complete",
  Pause = "pause",
}

export type RoundParticipant = {
  teamId: string;
  challenges: string[];
  isWinner: boolean;
  points: number;
  order: number;
};

export type RoundMark = {
  teamId: string;
  mark: number;
};
