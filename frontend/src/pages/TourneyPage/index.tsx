import { Center, Heading, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import api from "~/api";
import Loading from "~/components/Loading";
import { Team } from "~/types/team";
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
  const [teams, setTeams] = useState(mockTeams);

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
      <TourneyBracket teams={teams} />
      <TourneyTeams teams={teams} onChange={setTeams} />
      <TourneyTimersSettings id={tourney.id} settings={tourney.settings} />
      <TourneySpecificationsSettings
        id={tourney.id}
        specifications={tourney.specifications}
      />

      {/* TODO move this to match */}
      <TourneyArtifacts artifacts={[]} />
    </Stack>
  );
};

const mockTeams: Team[] = [
  {
    id: "T1",
    name: "Гномы",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T2",
    name: "Дворфы",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T3",
    name: "Полурослики",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T4",
    name: "Хоббиты",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T5",
    name: "Лилипуты",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T6",
    name: "Стуканцы",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T7",
    name: "Гремлины",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T8",
    name: "Коротышки",
    participants: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
];

export default TourneyPage;
