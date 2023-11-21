import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { Team } from "~/types/team";
import { Tourney, TourneyState, TourneyType } from "~/types/tourney";
import TourneyActionButtons from "./TourneyActionButtons";
import TourneyArtifacts from "./TourneyArtifacts";
import TourneyBracket from "./TourneyBracket";
import TourneyHeader from "./TourneyHeader";
import TourneyScenariosSettings from "./TourneyScenariosSettings";
import TourneyTeams from "./TourneyTeams";
import TourneyTimersSettings from "./TourneyTimersSettings";

const TourneyPage = () => {
  const [teams, setTeams] = useState(mockTeams);

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
      <TourneyActionButtons tourneyId={mockTourney.id} />
      <TourneyBracket teams={teams} />
      <TourneyTeams teams={teams} onChange={setTeams} />
      <TourneyTimersSettings tourneyId={mockTourney.id} />
      <TourneyScenariosSettings tourneyId={mockTourney.id} />
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

const mockTourney: Tourney = {
  id: uuid(),
  title: "RuCode",
  state: TourneyState.Prepare,
  form: TourneyType.Offline,
  startDate: new Date(),
  description: "г. Екатеринбург, улица Универсиады, 7",
};

export default TourneyPage;
