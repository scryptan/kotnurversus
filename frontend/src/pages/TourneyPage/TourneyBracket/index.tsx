import { Button, HStack, Heading } from "@chakra-ui/react";
import { SingleEliminationBracket } from "@g-loot/react-tournament-brackets";
import { CommonTreeProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { useEffect, useRef, useState } from "react";
import ShuffleIcon from "~/icons/ShuffleIcon";
import { Team } from "~/types/team";
import { isDefined } from "~/utils";
import { useAuthContext } from "~/utils/auth-context";
import { createMatchesFromTeams } from "~/utils/tourney";
import Match from "./Match";
import SvgViewer from "./SvgViewer";
import TeamsManualSortingButton from "./TeamsManualSortingButton";

type Props = {
  teams: Team[];
};

const TourneyBracket = ({ teams }: Props) => {
  const { isAuthenticated } = useAuthContext();
  const sortedTeams = useRef(teams);
  const [matches, setMatches] = useState(() =>
    createMatchesFromTeams(sortedTeams.current)
  );

  const teamsKey = teams.map((t) => `${t.id}:${t.name}`).join("|");

  useEffect(() => {
    const currentTeams = sortedTeams.current
      .map((team) => teams.find((t) => team.id === t.id))
      .filter(isDefined);
    const newTeams = teams.filter(
      (team) => !sortedTeams.current.find((t) => t.id === team.id)
    );
    sortedTeams.current = [...currentTeams, ...newTeams];
    setMatches(createMatchesFromTeams(sortedTeams.current));
  }, [teamsKey]);

  const handleChange = (teams: Team[]) => {
    sortedTeams.current = teams;
    setMatches(createMatchesFromTeams(sortedTeams.current));
  };

  if (teams.length < 3) {
    const message = isAuthenticated
      ? "Создайте минимум 2 команды для построения турнирной сетки"
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
        <ActionsButton
          teams={sortedTeams.current}
          onTeamsChange={handleChange}
        />
      </>
    );
  }

  return bracket;
};

const options: CommonTreeProps["options"] = {
  style: {
    width: 256,
    boxHeight: 84,
    spaceBetweenRows: 20,
    connectorColor: "#ADADAD",
    roundHeader: { isShown: false },
    lineInfo: {
      homeVisitorSpread: 0,
    },
  },
};

type ActionsButtonProps = {
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
};

const ActionsButton = ({ teams, onTeamsChange }: ActionsButtonProps) => (
  <HStack>
    <Button
      leftIcon={<ShuffleIcon boxSize={4} />}
      onClick={() => onTeamsChange(teams.toShuffle())}
      children="Перемещать участников"
    />
    <TeamsManualSortingButton teams={teams} onSubmit={onTeamsChange} />
  </HStack>
);

export default TourneyBracket;
