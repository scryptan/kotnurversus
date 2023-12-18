import { useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { ReactNode, createContext, useContext, useMemo } from "react";
import api from "~/api";
import useDebounce from "~/hooks/useDebounce";
import useSubscriptions from "~/hooks/useSubscriptions";
import useValue, { ValueRef } from "~/hooks/useValue";
import { Tourney, TourneyState, TourneyTeam } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

type SubscribeKey = "teams";

type TourneyContext = {
  isEditable: boolean;
  useSubscribe: (key: SubscribeKey) => void;
  teams: ValueRef<TourneyTeam[]>;
};

const Context = createContext<TourneyContext>({
  isEditable: false,
  useSubscribe: () => {},
  teams: { get: [], set: () => {} },
});

type TourneyProviderProps = {
  tourney: Tourney;
  children: ReactNode;
};

export const TourneyProvider = ({
  tourney,
  children,
}: TourneyProviderProps) => {
  const debounce = useDebounce(500);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();
  const { ping, useSubscribe } = useSubscriptions<SubscribeKey>();

  const teams = useValue(tourney.teams, {
    onUpdate: (newTeams: TourneyTeam[]) => {
      ping("teams");
      debounce.set(async () => {
        const operations = compare({}, { teams: newTeams });
        const updatedTourney = await api.tourneys.patch(tourney.id, operations);
        queryClient.setQueryData(queryKeys.tourney(tourney.id), updatedTourney);
      });
    },
  });

  const isPrepare = tourney.state === TourneyState.Prepare;

  const contextValue = useMemo(
    () => ({
      isEditable: isAuthenticated && isPrepare,
      useSubscribe,
      teams,
    }),
    [tourney.id, isAuthenticated, isPrepare]
  );

  return <Context.Provider value={contextValue} children={children} />;
};

export const useTourneyContext = (): TourneyContext => useContext(Context);
