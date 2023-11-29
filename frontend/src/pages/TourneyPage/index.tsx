import { Center, Heading, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "~/api";
import Loading from "~/components/Loading";
import queryKeys from "~/utils/query-keys";
import TourneyActionButtons from "./TourneyActionButtons";
import TourneyArtifacts from "./TourneyArtifacts";
import TourneyBracket from "./TourneyBracket";
import TourneyHeader from "./TourneyHeader";
import TourneySpecificationsSettings from "./TourneySpecificationsSettings";
import TourneyTeams from "./TourneyTeams";
import TourneyTimersSettings from "./TourneyTimersSettings";

type PageParams = {
  tourneyId: string;
};

const TourneyPage = () => {
  const { tourneyId = "" } = useParams<PageParams>();

  const tourneyQuery = useQuery({
    queryKey: queryKeys.tourney(tourneyId),
    queryFn: () => api.tourneys.getById(tourneyId),
    staleTime: 1000 * 60 * 5,
  });

  if (tourneyQuery.isLoading) {
    return <Loading flex={1} />;
  }

  const tourney = tourneyQuery.data;

  if (!tourney) {
    return (
      <Center flex={1}>
        <Heading>Турнир не найден</Heading>
      </Center>
    );
  }

  return (
    <Stack
      px={2}
      pb={20}
      mx="auto"
      w="full"
      maxW="wrapper"
      flex={1}
      spacing={8}
    >
      <TourneyHeader tourney={tourney} />
      <TourneyActionButtons tourneyId={tourney.id} />
      <TourneyTimersSettings id={tourney.id} settings={tourney.settings} />
      <TourneySpecificationsSettings
        id={tourney.id}
        specifications={tourney.specifications}
      />
      <TourneyBracket
        id={tourney.id}
        teams={tourney.teams}
        specifications={tourney.specifications}
      />
      <TourneyTeams id={tourney.id} teams={tourney.teams} />

      {/* TODO move this to match */}
      <TourneyArtifacts artifacts={[]} />
    </Stack>
  );
};

export default TourneyPage;
