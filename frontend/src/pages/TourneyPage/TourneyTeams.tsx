import { Heading, Stack, Wrap } from "@chakra-ui/react";
import { useRef } from "react";
import { v4 as uuid } from "uuid";
import TeamCard from "~/components/TeamCard";
import useForceUpdate from "~/hooks/useForceUpdate";
import { Team } from "~/types/team";
import { useAuthContext } from "~/utils/auth-context";

type Props = {
  teams: Team[];
};

const TourneyTeams = ({ teams: defaultTeams }: Props) => {
  const { isAuthenticated } = useAuthContext();
  const { forceUpdate } = useForceUpdate();
  const teams = useRef(defaultTeams);
  const defaultTeam = useRef(createDefaultTeam());

  const handleAdd = (team: Team) => {
    teams.current = [...teams.current, team];
    defaultTeam.current = createDefaultTeam();
    forceUpdate();
  };

  const handleChange = (team: Team) => {
    teams.current = teams.current.map((t) => (t.id === team.id ? team : t));
  };

  const handleRemove = (teamId: string) => {
    teams.current = teams.current.filter((t) => t.id !== teamId);
    forceUpdate();
  };

  const allTeams = isAuthenticated
    ? [...teams.current, defaultTeam.current]
    : teams.current;

  return (
    <Stack spacing={6}>
      <Heading px={3} fontSize="3xl">
        Участники
      </Heading>
      <Wrap spacing={10}>
        {allTeams.map((team) => {
          const isDefault = team.id === defaultTeam.current.id;
          return (
            <TeamCard
              key={team.id}
              team={team}
              isEditMode={isAuthenticated}
              onChange={isDefault ? handleAdd : handleChange}
              onRemove={isDefault ? undefined : handleRemove}
            />
          );
        })}
      </Wrap>
    </Stack>
  );
};

const createDefaultTeam = (): Partial<Team> => ({
  id: uuid(),
  participants: [""],
});

export default TourneyTeams;
