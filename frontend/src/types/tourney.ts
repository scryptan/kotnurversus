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
  order: number;
};

export type TourneySpecificationWithId = TourneySpecification & { id: string };

export type TourneyTeam = {
  id: string;
  title: string;
  mates: string[];
  order: number;
};

export type TourneyRound = {
  id: string;
  nextMatchId: string | null;
  startTime: string;
  state: TourneyRoundState;
  participants: TourneyRoundTeam[];
  specification?: TourneySpecification;
  badgeValue?: number;
  isLoading?: boolean;
};

export enum TourneyRoundState {
  Init = "init",
  InitReady = "init-ready",
  Prepare = "prepare",
  Presentation = "presentation",
  Defense = "defense",
  Mark = "mark",
  Complete = "complete",
  Pause = "pause",
}

export type TourneyRoundTeam = {
  id: string;
  name: string;
  resultText?: string;
  isWinner?: boolean;
};

export type TourneyArtifact = {
  name: string;
  link: string;
};
