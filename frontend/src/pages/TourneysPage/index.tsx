import { Button, HStack, Heading, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Input from "~/components/Input";
import PlusIcon from "~/icons/PlusIcon";
import SearchIcon from "~/icons/SearchIcon";
import paths from "~/pages/paths";
import { Tourney, TourneyType } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import TourneysTable from "./TourneysTable";

const TourneysPage = () => (
  <Stack mx="auto" p={8} w="full" maxW="wrapper" flex={1} spacing={10}>
    <HStack justify="space-between">
      <Heading fontSize="4xl">Турниры по архитектуре приложений</Heading>
      <CreateTourneyButton />
    </HStack>
    <Input
      placeholder="Поиск по названию турнира"
      rightElement={<SearchIcon boxSize={6} />}
      rightElementProps={{ pointerEvents: "none" }}
      containerProps={{ mx: "auto", w: "70%" }}
    />
    <Stack spacing={8}>
      <TourneysTable title="Текущие турниры" tourneys={mockTourneys} />
      <TourneysTable title="Будущие турниры" tourneys={mockTourneys} />
      <TourneysTable title="Прошедшие турниры" tourneys={mockTourneys} />
    </Stack>
  </Stack>
);

const CreateTourneyButton = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      as={Link}
      size="lg"
      colorScheme="teal"
      to={paths.createTourney.path}
      leftIcon={<PlusIcon boxSize={6} />}
      children="Создать турнир"
    />
  );
};

const mockTourneys: Tourney[] = [...Array(5)].map((_, i) => ({
  id: i + 1,
  name: `Турнир ${i + 1}`,
  startDate: new Date(),
  type: TourneyType.Offline,
}));

export default TourneysPage;
