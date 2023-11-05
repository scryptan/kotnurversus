import { Stack } from "@chakra-ui/react";
import { Team } from "~/types/team";
import { TourneyFullInfo, TourneyMatchState } from "~/types/tourney";
import TourneyArtifacts from "./TourneyArtifacts";
import TourneyBracket from "./TourneyBracket";
import TourneyHeader from "./TourneyHeader";
import TourneyTeams from "./TourneyTeams";

const TourneyPage = () => (
  <Stack px={2} pb={20} mx="auto" w="full" maxW="wrapper" flex={1} spacing={8}>
    <TourneyHeader tourney={mockTourney} />
    <TourneyBracket matches={mockTourney.matches} />
    <TourneyTeams teams={mockTeams} />
    <TourneyArtifacts artifacts={mockTourney.artifacts} />
  </Stack>
);

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
  type: "Очный",
  location: "г. Екатеринбург, улица Универсиады, 7",
  organizer: "УрФУ",
  matches: [
    {
      id: 1,
      name: "A1",
      nextMatchId: 5,
      startTime: "2021-05-30",
      state: TourneyMatchState.Done,
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
      id: 2,
      name: "A2",
      nextMatchId: 5,
      startTime: "2021-05-30",
      state: TourneyMatchState.Done,
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
      id: 3,
      name: "A3",
      nextMatchId: 6,
      startTime: "2021-05-30",
      state: TourneyMatchState.Played,
      participants: [
        { id: "T5", name: "Лилипуты" },
        { id: "T6", name: "Стуканцы" },
      ],
    },
    {
      id: 4,
      name: "A4",
      nextMatchId: 6,
      startTime: "2021-05-30",
      state: TourneyMatchState.Scheduled,
      participants: [
        { id: "T7", name: "Гремлины" },
        { id: "T8", name: "Коротышки" },
      ],
    },
    {
      id: 5,
      name: "A5",
      nextMatchId: 7,
      startTime: "2021-05-31",
      state: TourneyMatchState.Scheduled,
      participants: [
        { id: "T4", name: "Хоббиты" },
        { id: "T1", name: "Гномы" },
      ],
    },
    {
      id: 6,
      name: "A6",
      nextMatchId: 7,
      startTime: "2021-05-30",
      state: TourneyMatchState.Scheduled,
      participants: [
        // { id: "T5", name: "Лилипуты" },
        // { id: "T7", name: "Гремлины" },
      ],
    },
    {
      id: 7,
      name: "A7",
      nextMatchId: null,
      startTime: "2021-05-30",
      state: TourneyMatchState.Scheduled,
      participants: [],
    },
  ],
  artifacts: [
    { name: "Ссылка на гугл, чтоб не забывали", link: "https://google.com" },
  ],
};

export default TourneyPage;
