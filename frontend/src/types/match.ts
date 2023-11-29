import { Tourney } from "~/types/tourney";

export type Match = {
  id: number;
  state: TourneyRoundState;
  startDate?: Date;
  tourney: Tourney;
  teams: MatchTeam[];
  task: MatchTask;
};

export enum TourneyRoundState {
  WalkOver = "WALK_OVER",
  Init = "INIT",
  Prepare = "PREPARE",
  Play = "PLAY",
  Defense = "DEFENSE",
  Done = "DONE",
}

export type MatchTeam = {
  id: string;
  name: string;
  isWinner?: boolean;
  participants: string[];
};

export type MatchTask = {
  name: string;
  scenario?: string;
  description?: string;
  generalRequirements?: string;
};
