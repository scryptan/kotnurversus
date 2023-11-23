import { HStack, Heading } from "@chakra-ui/react";
import { SingleEliminationBracket } from "@g-loot/react-tournament-brackets";
import { CommonTreeProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { memo, useEffect, useState } from "react";
import api from "~/api";
import { TourneySpecification, TourneyTeam } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import { addSpecificationToRound } from "~/utils/match";
import queryKeys from "~/utils/query-keys";
import { createMatchesFromTeams } from "~/utils/tourney";
import Match from "./Match";
import SvgViewer from "./SvgViewer";
import TeamsManualSortingButton from "./TeamsManualSortingButton";
import TeamsShuffleButton from "./TeamsShuffleButton";

type Props = {
  id: string;
  teams: TourneyTeam[];
  specifications: TourneySpecification[];
};

const TourneyBracket = ({ id, teams, specifications }: Props) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();

  const calcMatches = (teams: TourneyTeam[]) => {
    const matches = createMatchesFromTeams(teams);
    return isAuthenticated
      ? matches.map(addSpecificationToRound(specifications))
      : matches;
  };

  const [matches, setMatches] = useState(() => calcMatches(teams));

  const editTeams = useMutation({
    mutationFn: async (teams: TourneyTeam[]) => {
      const operations = compare({}, { teams });
      return await api.tourneys.patch(id, operations);
    },
    onSuccess: async (tourney) => {
      queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
    },
  });

  useEffect(() => {
    setMatches(calcMatches(teams));
  }, [teams, specifications, isAuthenticated]);

  const handleChange = async (newTeams: TourneyTeam[]) => {
    await editTeams.mutateAsync(newTeams);
  };

  if (teams.length < 4) {
    const message = isAuthenticated
      ? "Создайте минимум 4 команды для построения турнирной сетки"
      : "Турнирная сетка ещё не построена";

    return <Heading my="100px" mx="auto" fontSize="lg" children={message} />;
  }

  const bracket = (
    <SingleEliminationBracket
      options={options}
      matches={matches}
      matchComponent={Match}
      svgWrapper={({ children, ...props }) => (
        <SvgViewer {...props} containerProps={{ px: 4 }} children={children} />
      )}
    />
  );

  if (isAuthenticated) {
    return (
      <>
        {bracket}
        <ActionsButton teams={teams} onTeamsChange={handleChange} />
      </>
    );
  }

  return bracket;
};

const options: CommonTreeProps["options"] = {
  style: {
    width: 268,
    boxHeight: 124,
    spaceBetweenRows: 20,
    horizontalOffset: 0,
    roundSeparatorWidth: 50,
    connectorColor: "#ADADAD",
    roundHeader: { isShown: false },
    lineInfo: {
      homeVisitorSpread: 0,
    },
  },
};

type ActionsButtonProps = {
  teams: TourneyTeam[];
  onTeamsChange: (teams: TourneyTeam[]) => Promise<void>;
};

const ActionsButton = ({ teams, onTeamsChange }: ActionsButtonProps) => (
  <HStack>
    <TeamsShuffleButton teams={teams} onTeamsChange={onTeamsChange} />
    <TeamsManualSortingButton teams={teams} onSubmit={onTeamsChange} />
  </HStack>
);

const calcTeamsKey = (teams: TourneyTeam[]) =>
  teams.map((t) => `${t.id}:${t.title}`).join("|");

const calcSpecificationsKey = (specifications: TourneySpecification[]) =>
  specifications.map((s) => s.title).join("|");

export default memo(TourneyBracket, (prev, next) => {
  return (
    prev.id === next.id &&
    calcTeamsKey(prev.teams) === calcTeamsKey(next.teams) &&
    calcSpecificationsKey(prev.specifications) ===
      calcSpecificationsKey(next.specifications)
  );
});
