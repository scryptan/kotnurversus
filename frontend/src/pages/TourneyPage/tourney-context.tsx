import { useMediaQuery } from "@chakra-ui/react";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { Tourney, TourneyState } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";

type TourneyContext = {
  isDesktop: boolean;
  isEditable: boolean;
};

const Context = createContext<TourneyContext>({
  isDesktop: true,
  isEditable: false,
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
  const [isDesktop] = useMediaQuery("(min-width: 48em)");
  const isPrepare = tourney.state === TourneyState.Prepare;

  const contextValue = useMemo(
    () => ({
      isDesktop,
      isEditable: isDesktop && isAuthenticated && isPrepare,
    }),
    [isDesktop, isAuthenticated, isPrepare]
  );

  return <Context.Provider value={contextValue} children={children} />;
};

export const useTourneyContext = (): TourneyContext => useContext(Context);
