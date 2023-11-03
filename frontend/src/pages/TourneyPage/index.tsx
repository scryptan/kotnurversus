import { Stack } from "@chakra-ui/react";
import { TourneyFullInfo, TourneyMatchState } from "~/types/tourney";
import TourneyBracket from "./TourneyBracket";
import TourneyHeader from "./TourneyHeader";

const TourneyPage = () => (
  <Stack px={2} mx="auto" w="full" maxW="wrapper" flex={1} spacing={8}>
    <TourneyHeader tourney={mockTourney} />
    <TourneyBracket matches={mockTourney.matches} />
  </Stack>
);

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
          status: TourneyMatchState.Done,
        },
        {
          id: "T2",
          name: "Дворфы",
          resultText: "3",
          status: TourneyMatchState.Done,
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
};

export default TourneyPage;
