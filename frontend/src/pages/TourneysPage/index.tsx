import { Heading, Stack } from "@chakra-ui/react";
import Input from "~/components/Input";
import SearchIcon from "~/icons/SearchIcon";
import TourneysTable from "./TourneysTable";
import { Tourney } from "~/types/tourney";

const TourneysPage = () => (
  <Stack mx="auto" p={8} w="full" maxW="wrapper" flex={1} spacing={10}>
    <Heading fontSize="4xl">Турниры по архитектуре приложений</Heading>
    <Input
      placeholder="Поиск по названию турнира"
      rightElement={<SearchIcon boxSize={6} />}
      rightElementProps={{ pointerEvents: "none" }}
      containerProps={{ mx: "auto", w: "70%" }}
    />
    <Stack spacing={8}>
      <TourneysTable title="Будущие турниры" tourneys={mockTourneys} />
      <TourneysTable title="Текущие турниры" tourneys={mockTourneys} />
      <TourneysTable title="Прошедшие турниры" tourneys={mockTourneys} />
    </Stack>
  </Stack>
);

const mockTourneys: Tourney[] = [...Array(5)].map((_, i) => ({
  id: i + 1,
  name: `Турнир ${i + 1}`,
  startDate: new Date(),
  type: "Очно",
}));

export default TourneysPage;
