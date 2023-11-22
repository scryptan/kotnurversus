import { Heading, Stack, Wrap } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { memo, useRef } from "react";
import { v4 as uuid } from "uuid";
import api from "~/api";
import TeamCard from "~/components/TeamCard";
import useDebounce from "~/hooks/useDebounce";
import useForceUpdate from "~/hooks/useForceUpdate";
import { TourneyTeam } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

type Props = {
  id: string;
  teams: TourneyTeam[];
};

const TourneyTeams = ({ id, teams: defaultTeams }: Props) => {
  const debounce = useDebounce(500);
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();
  const { forceUpdate } = useForceUpdate();
  const teams = useRef(defaultTeams);
  const defaultTeam = useRef(createDefaultTeam());

  const editTeams = useMutation({
    mutationFn: async (teams: TourneyTeam[]) => {
      const operations = compare({}, { teams });
      return await api.tourneys.patch(id, operations);
    },
    onSuccess: async (tourney) => {
      queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
    },
  });

  const handleUpdate = (newTeams: TourneyTeam[]) => {
    teams.current = newTeams;
    debounce.set(() => editTeams.mutateAsync(newTeams));
  };

  const handleAdd = (team: TourneyTeam) => {
    handleUpdate([...teams.current, team]);
    defaultTeam.current = createDefaultTeam();
    forceUpdate();
  };

  const handleChange = (team: TourneyTeam) => {
    handleUpdate(teams.current.map((t) => (t.id === team.id ? team : t)));
  };

  const handleRemove = (teamId: string) => {
    handleUpdate(teams.current.filter((t) => t.id !== teamId));
    forceUpdate();
  };

  const allTeams = isAuthenticated
    ? [...teams.current, defaultTeam.current]
    : teams.current;

  if (!isAuthenticated && allTeams.length < 1) {
    return null;
  }

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

const createDefaultTeam = (): Partial<TourneyTeam> => ({
  id: uuid(),
  mates: [""],
});

export default memo(TourneyTeams, () => true);
