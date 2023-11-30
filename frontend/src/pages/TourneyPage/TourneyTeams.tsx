import { Wrap } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { compare } from "fast-json-patch";
import { memo, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import api from "~/api";
import TeamCard from "~/components/TeamCard";
import useDebounce from "~/hooks/useDebounce";
import useForceUpdate from "~/hooks/useForceUpdate";
import { TourneyTeam } from "~/types/tourney";
import queryKeys from "~/utils/query-keys";
import TourneySectionLayout from "./TourneySectionLayout";
import { useTourneyContext } from "./tourney-context";

type Props = {
  id: string;
  teams: TourneyTeam[];
};

const TourneyTeams = ({ id, teams: defaultTeams }: Props) => {
  const debounce = useDebounce(500);
  const queryClient = useQueryClient();
  const { isEditable } = useTourneyContext();
  const { forceUpdate } = useForceUpdate();
  const teams = useRef(defaultTeams);
  const defaultTeam = useRef(createDefaultTeam());

  useEffect(() => {
    teams.current = defaultTeams;
    forceUpdate();
  }, [defaultTeams]);

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
    handleUpdate([...teams.current, team].map((t, i) => ({ ...t, order: i })));
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

  const allTeams = isEditable
    ? [...teams.current, defaultTeam.current]
    : teams.current;

  if (!isEditable && allTeams.length < 1) {
    return null;
  }

  return (
    <TourneySectionLayout
      defaultIsOpen
      heading="Участники"
      storageKey={`tourney:${id}:teams-visibility `}
    >
      <Wrap mt={6} spacing={10}>
        {allTeams.map((team) => {
          const isDefault = team.id === defaultTeam.current.id;

          if (isEditable) {
            return <TeamCard.Base key={team.id} team={team} />;
          }

          return (
            <TeamCard.Editable
              key={team.id}
              team={team}
              onChange={isDefault ? handleAdd : handleChange}
              onRemove={isDefault ? undefined : handleRemove}
            />
          );
        })}
      </Wrap>
    </TourneySectionLayout>
  );
};

const createDefaultTeam = (): Partial<TourneyTeam> => ({
  id: uuid(),
  mates: [""],
});

const createTeamsKey = (teams: TourneyTeam[]) =>
  teams.map((t) => t.id).join("|");

export default memo(TourneyTeams, (prev, next) => {
  return (
    prev.id === next.id &&
    createTeamsKey(prev.teams) === createTeamsKey(next.teams)
  );
});
