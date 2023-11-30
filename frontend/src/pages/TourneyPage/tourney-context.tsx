import { ReactNode, createContext, useContext, useMemo } from "react";
import { Tourney, TourneyState } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";

type TourneyContext = {
  isEditable: boolean;
  isAuthenticated: boolean;
};

const Context = createContext<TourneyContext>({
  isEditable: false,
  isAuthenticated: false,
});

type TourneyProviderProps = {
  tourney: Tourney;
  children: ReactNode;
};

export const TourneyProvider = ({
  tourney,
  children,
}: TourneyProviderProps) => {
  const { isAuthenticated } = useAuthContext();
  const isPrepare = tourney.state === TourneyState.Prepare;

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isEditable: isAuthenticated && isPrepare,
    }),
    [isAuthenticated, isPrepare]
  );

  return <Context.Provider value={contextValue} children={children} />;
};

export const useTourneyContext = (): TourneyContext => useContext(Context);