import { Stack, Text } from "@chakra-ui/react";
import { Match, MatchState } from "~/types/match";
import MatchHeader from "./MatchHeader";
import MatchStateSection from "./MatchStateSection";
import MatchTaskSection from "./MatchTaskSection";
import { TourneyState, TourneyType } from "~/types/tourney";

const MatchPage = () => (
  <Stack px={2} pb={20} mx="auto" w="full" maxW="wrapper" flex={1} spacing={8}>
    <MatchHeader match={mockMatch} />
    <Text fontSize="3xl" fontWeight="medium" textAlign="center">
      Задача - <b>{mockMatch.task.name}</b>
    </Text>
    <MatchStateSection match={mockMatch} />
    <MatchTaskSection task={mockMatch.task} />
  </Stack>
);

const mockMatch: Match = {
  id: 1,
  state: MatchState.Prepare,
  tourney: {
    id: "1",
    title: "RuCode",
    state: TourneyState.Prepare,
    form: TourneyType.Offline,
    startDate: new Date(),
  },
  teams: [
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
  ],
  task: {
    name: "Сервис самокатного шеринга",
    scenario: "Сервис самокатного шеринга",
    description: `
    Сервис для самостоятельно аренды самокатов по городу. Функциональный аналог Whoosh и др.
    Вводные данные
    — 100 млн поездок в год
    — Парк из 150 000 самокатов
    — Сервис охватывает несколько стран (Россия и ближнее зарубежье)
    `,
    generalRequirements: `
    — При проектировании постараться использовать оптимальное количество ресурсов и не изобретать серебряную пулю. Недостаточно использовать условный Houston или Kubernetes — нужно явно обозначить, какие фичи требуются. Выбор технологий должен быть аргументированным.
    — Архитектура должна обеспечить работу основных сценариев и удовлетворять заданным требованиям.
    — 100-200мс на осмысленный ответ клиенту (важно: речь не про завершение сценария, а именно про успешный HTTP-ответ).
    `,
  },
};

export default MatchPage;
