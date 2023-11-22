import { MatchState } from "~/types/match";

export type Tourney = {
  id: string;
  title: string;
  state: TourneyState;
  form: TourneyType;
  startDate: Date;
  description?: string;
  settings: TourneySettings;
  specifications: TourneySpecification[];
  teams: TourneyTeam[];
};

export type CreateTourney = {
  title: string;
  form: TourneyType;
  startDate: Date;
  description?: string;
  settings?: TourneySettings;
  specifications?: TourneySpecification[];
};

export enum TourneyState {
  Prepare = "prepare",
  InProgress = "inProgress",
  Complete = "complete",
}

export enum TourneyType {
  Offline = "offline",
  Online = "online",
}

export type TourneySettings = {
  timeoutsCount: number;
  timeoutSeconds: number;
  prepareSeconds: number;
  presentationSeconds: number;
  defenseSeconds: number;
};

export type TourneySpecification = {
  title: string;
  businessDescription?: string;
  techDescription?: string;
};

export type TourneySpecificationWithId = TourneySpecification & { id: string };

export type TourneyTeam = {
  id: string;
  title: string;
  mates: string[];
};

export type TourneyMatch = {
  id: string;
  nextMatchId: string | null;
  startTime: string;
  state: MatchState;
  participants: TourneyMatchTeam[];
  specificationTitle?: string | null;
  badgeValue?: number;
};

export type TourneyMatchTeam = {
  id: string;
  name: string;
  resultText?: string;
  isWinner?: boolean;
};

export type TourneyArtifact = {
  name: string;
  link: string;
};
