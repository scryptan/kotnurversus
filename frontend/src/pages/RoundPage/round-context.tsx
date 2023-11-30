import { Center, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext } from "react";
import api from "~/api";
import Loading from "~/components/Loading";
import { Round } from "~/types/round";
import { Tourney } from "~/types/tourney";
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
  const { tourney, round } = useContext(Context);

  const state = round.currentState?.state;

  const getTeams = () =>
    round.participants.map((p) =>
      tourney.teams.find((team) => p.teamId === team.id)
    );

  return {
    tourney,
    round,
    state,
    getTeams,
  };
};
