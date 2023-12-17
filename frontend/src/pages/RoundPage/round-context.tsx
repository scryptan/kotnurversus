import { Center, Heading, useBreakpointValue } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { addSeconds } from "date-fns";
import { ReactNode, createContext, useContext } from "react";
import api from "~/api";
import Loading from "~/components/Loading";
import { Round, RoundState } from "~/types/round";
import { Tourney } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

type RoundContext = {
  tourney: Tourney;
  round: Round;
};

const Context = createContext<RoundContext>({
  tourney: {} as Tourney,
  round: {} as Round,
});

type RoundProviderProps = {
  roundId: string;
  children: ReactNode;
};

export const RoundProvider = ({ roundId, children }: RoundProviderProps) => {
  const roundQuery = useQuery({
    queryKey: queryKeys.round(roundId),
    queryFn: () => api.rounds.getById(roundId),
    enabled: Boolean(roundId),
    refetchInterval: 1000 * 5,
  });

  const tourneyQuery = useQuery({
    queryKey: queryKeys.tourney(roundQuery.data?.gameId),
    queryFn: () => api.tourneys.getById(roundQuery.data?.gameId || ""),
    enabled: Boolean(roundQuery.data?.gameId),
    staleTime: 1000 * 60,
  });

  if (roundQuery.isLoading || tourneyQuery.isLoading) {
    return <Loading flex={1} />;
  }

  if (!roundQuery.data || !tourneyQuery.data) {
    return (
      <Center flex={1}>
        <Heading>Турнир или раунд не найден</Heading>
      </Center>
    );
  }

  const contextValue = { tourney: tourneyQuery.data, round: roundQuery.data };

  return <Context.Provider value={contextValue} children={children} />;
};

export const useRoundContext = () => {
  const { isAuthenticated } = useAuthContext();
  const { tourney, round } = useContext(Context);
  const isDesktop = useBreakpointValue(
    { base: false, sm: true },
    { ssr: false }
  );

  const state = round.currentState?.state;
  const isPublic = state !== undefined;
  const currentTeamId = round.currentState?.value?.teamId;

  const getTeams = () =>
    round.participants
      .map((p) => tourney.teams.find((team) => p.teamId === team.id))
      .slice(0, 2);

  const getCurrentTeam = () =>
    tourney.teams.find((t) => t.id === currentTeamId);

  const getTimerEnd = () => {
    const startTime = round.currentState?.value?.start;
    if (!startTime) return undefined;
    switch (state) {
      case RoundState.Prepare:
        return addSeconds(startTime, round.settings.prepareSeconds);
      case RoundState.Presentation:
        return addSeconds(startTime, round.settings.presentationSeconds);
      case RoundState.Defense:
        return addSeconds(startTime, round.settings.defenseSeconds);
      case RoundState.Pause:
        return addSeconds(startTime, round.settings.timeoutSeconds);
      default:
        return undefined;
    }
  };

  const isStateFirstTime = (state: RoundState): boolean =>
    round.history.filter((s) => s.state === state).length < 2;

  return {
    isPublic,
    isOrganizer: isDesktop && isAuthenticated,
    tourney,
    round,
    state,
    currentTeamId,
    getTeams,
    getTimerEnd,
    getCurrentTeam,
    isStateFirstTime,
  };
};
