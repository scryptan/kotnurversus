import { Center, Heading, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import api from "~/api";
import Loading from "~/components/Loading";
import { TourneyTeam } from "~/types/tourney";
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
      <TourneyBracket
        teams={mockTeams}
        specifications={tourney.specifications}
      />
      <TourneyTeams id={tourney.id} teams={tourney.teams} />
      <TourneySpecificationsSettings
        id={tourney.id}
        specifications={tourney.specifications}
      />
      <TourneyTimersSettings id={tourney.id} settings={tourney.settings} />

      {/* TODO move this to match */}
      <TourneyArtifacts artifacts={[]} />
    </Stack>
  );
};

const mockTeams: TourneyTeam[] = [
  {
    id: "T1",
    title: "Гномы",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T2",
    title: "Дворфы",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T3",
    title: "Полурослики",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T4",
    title: "Хоббиты",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T5",
    title: "Лилипуты",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T6",
    title: "Стуканцы",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T7",
    title: "Гремлины",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
  {
    id: "T8",
    title: "Коротышки",
    mates: [
      "Кислицин Денис",
      "Ведешкин Никита",
      "Дон Дарья",
      "Третьяков Максим",
      "Казаков Салават",
    ],
  },
];

export default TourneyPage;
