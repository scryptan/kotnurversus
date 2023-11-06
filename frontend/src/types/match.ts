import { Tourney } from "~/types/tourney";

export type Match = {
  id: number;
  state: MatchState;
  startDate?: Date;
  tourney: Tourney;
  teams: MatchTeam[];
  task: MatchTask;
};

export enum MatchState {
  WalkOver = "WALK_OVER",
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