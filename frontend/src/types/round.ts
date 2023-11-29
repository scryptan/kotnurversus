import { TourneySettings, TourneySpecification } from "~/types/tourney";

export type Round = {
  id: string;
  nextRoundId?: string;
  gameId: string;
  settings: TourneySettings;
  participants: RoundParticipant[];
  artifacts: unknown[];
  history: unknown[];
  winnerId?: string;
  order: number;
};

export type CreateRound = {
  gameId: string;
  nextRoundId?: string | null;
  participants: RoundParticipant[];
  specification: TourneySpecification;
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
