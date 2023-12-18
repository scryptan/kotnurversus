import { Wrap } from "@chakra-ui/react";
import { memo, useRef } from "react";
import { v4 as uuid } from "uuid";
import CollapsibleSection from "~/components/CollapsibleSection";
import TeamCard from "~/components/TeamCard";
import useForceUpdate from "~/hooks/useForceUpdate";
import { TourneyTeam } from "~/types/tourney";
import { useTourneyContext } from "./tourney-context";

type Props = {
  id: string;
};

const TourneyTeams = ({ id }: Props) => {
  const { isEditable, teams, useSubscribe } = useTourneyContext();
  const { forceUpdate } = useForceUpdate();
  const defaultTeam = useRef(createDefaultTeam());

  useSubscribe("teams");

  const handleAdd = (team: TourneyTeam) => {
    teams.set([...teams.get, team].map((t, i) => ({ ...t, order: i })));
    defaultTeam.current = createDefaultTeam();
    forceUpdate();
  };

  const handleChange = (team: TourneyTeam) => {
    teams.set(teams.get.map((t) => (t.id === team.id ? team : t)));
  };

  const handleRemove = (teamId: string) => {
    teams.set(teams.get.filter((t) => t.id !== teamId));
    forceUpdate();
  };

  const allTeams = isEditable ? [...teams.get, defaultTeam.current] : teams.get;

  if (!isEditable && allTeams.length < 1) {
    return null;
  }

  return (
    <CollapsibleSection
      label="Участники"
      storageKey={`tourney:${id}:teams-visibility`}
      headerProps={{ px: { base: 2, md: 0 } }}
    >
      <Wrap
        mt={{ base: 4, md: 6 }}
        spacing={{ base: 4, md: 10 }}
        justify={{ base: "space-evenly", xl: "flex-start" }}
      >
        {allTeams.map((team) => {
          const isDefault = team.id === defaultTeam.current.id;

          if (isEditable) {
            return (
              <TeamCard.Editable
                key={team.id}
                team={team}
                onChange={isDefault ? handleAdd : handleChange}
                onRemove={isDefault ? undefined : handleRemove}
              />
            );
          }

          return <TeamCard.Base key={team.id} team={team} />;
        })}
      </Wrap>
    </CollapsibleSection>
  );
};

const createDefaultTeam = (): Partial<TourneyTeam> => ({
  id: uuid(),
  mates: [""],
});

export default memo(TourneyTeams);
