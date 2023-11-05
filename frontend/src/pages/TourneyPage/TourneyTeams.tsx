import { Heading, Stack, Wrap } from "@chakra-ui/react";
import TeamCard from "~/components/TeamCard";
import { Team } from "~/types/team";

type Props = {
  teams: Team[];
};

const TourneyTeams = ({ teams }: Props) => (
  <Stack spacing={6}>
    <Heading px={3} fontSize="3xl">
      Участники
    </Heading>
    <Wrap spacing={10} justify="space-around">
      {teams.map((t) => (
        <TeamCard key={t.id} team={t} />
      ))}
    </Wrap>
  </Stack>
);

export default TourneyTeams;
