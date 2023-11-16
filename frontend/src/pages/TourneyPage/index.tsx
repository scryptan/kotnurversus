import { Stack } from "@chakra-ui/react";
import { MatchState } from "~/types/match";
import { Team } from "~/types/team";
import { TourneyFullInfo, TourneyType } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import { createMatchesFromTeams } from "~/utils/tourney";
import TourneyActionButtons from "./TourneyActionButtons";
import TourneyArtifacts from "./TourneyArtifacts";
import TourneyBracket from "./TourneyBracket";
import TourneyHeader from "./TourneyHeader";
import TourneyTeams from "./TourneyTeams";

const TourneyPage = () => {
  const { isAuthenticated } = useAuthContext();
  const matches = createMatchesFromTeams(mockTeams);

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
      <TourneyHeader tourney={mockTourney} />
      {isAuthenticated && <TourneyActionButtons tourneyId={mockTourney.id} />}
      <TourneyBracket matches={matches} />
      <TourneyTeams teams={mockTeams} />
      <TourneyArtifacts artifacts={mockTourney.artifacts} />
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

const mockTourney: TourneyFullInfo = {
  id: 1,
  name: "RuCode",
  startDate: new Date(),
  type: TourneyType.Offline,
  location: "г. Екатеринбург, улица Универсиады, 7",
  organizer: "УрФУ",
  matches: [
    {
      id: "1",
      nextMatchId: "5",
      startTime: "2021-05-30",
      state: MatchState.Init,
      participants: [
        {
          id: "T1",
          name: "Гномы",
          resultText: "4",
          isWinner: true,
        },
        {
          id: "T2",
          name: "Дворфы",
          resultText: "3",
        },
      ],
    },
    {
      id: "2",
      nextMatchId: "5",
      startTime: "2021-05-30",
      state: MatchState.Done,
      participants: [
        {
          id: "T3",
          name: "Полурослики",
          resultText: "4",
        },
        {
          id: "T4",
          name: "Хоббиты",
          resultText: "3",
          isWinner: true,
        },
      ],
    },
    {
      id: "3",
      nextMatchId: "6",
      startTime: "2021-05-30",
      state: MatchState.Play,
      participants: [
        { id: "T5", name: "Лилипуты" },
        { id: "T6", name: "Стуканцы" },
      ],
    },
    {
      id: "4",
      nextMatchId: "6",
      startTime: "2021-05-30",
      state: MatchState.Prepare,
      participants: [
        { id: "T7", name: "Гремлины" },
        { id: "T8", name: "Коротышки" },
      ],
    },
    {
      id: "5",
      nextMatchId: "7",
      startTime: "2021-05-31",
      state: MatchState.Prepare,
      participants: [
        { id: "T4", name: "Хоббиты" },
        { id: "T1", name: "Гномы" },
      ],
    },
    {
      id: "6",
      nextMatchId: "7",
      startTime: "2021-05-30",
      state: MatchState.Prepare,
      participants: [
        // { id: "T5", name: "Лилипуты" },
        // { id: "T7", name: "Гремлины" },
      ],
    },
    {
      id: "7",
      nextMatchId: null,
      startTime: "2021-05-30",
      state: MatchState.Prepare,
      participants: [],
    },
  ],
  artifacts: [
    { name: "Ссылка на гугл, чтоб не забывали", link: "https://google.com" },
  ],
};

export default TourneyPage;
