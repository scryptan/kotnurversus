import { Button, Center, HStack, Heading, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "~/api";
import Input from "~/components/Input";
import Loading from "~/components/Loading";
import PlusIcon from "~/icons/PlusIcon";
import SearchIcon from "~/icons/SearchIcon";
import paths from "~/pages/paths";
import { TourneyState } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";
import TourneysTable from "./TourneysTable";

const TourneysPage = () => (
  <Stack mx="auto" p={8} w="full" maxW="wrapper" flex={1} spacing={10}>
    <HStack justify="space-between">
      <Heading fontSize="4xl">Турниры по архитектуре приложений</Heading>
      <CreateTourneyButton />
    </HStack>
    <TourneysSection />
  </Stack>
);

const TourneysSection = () => {
  const tourneysQuery = useQuery({
    queryKey: queryKeys.tourneys,
    queryFn: api.tourneys.find,
    staleTime: 1000 * 60 * 5,
  });

  const tourneys = tourneysQuery.data?.items || [];
  const currentTourneys = tourneys.filter(
    (t) => t.state === TourneyState.InProgress
  );
  const pastTourneys = tourneys.filter(
    (t) => t.state === TourneyState.Complete
  );

  return (
    <>
      <Input
        size="lg"
        placeholder="Поиск по названию турнира"
        rightElement={<SearchIcon boxSize={6} />}
        rightElementProps={{ pointerEvents: "none" }}
        containerProps={{ mx: "auto", w: "70%" }}
      />
      {tourneysQuery.isLoading ? (
        <Loading py={10} />
      ) : currentTourneys.length > 0 || pastTourneys.length > 0 ? (
        <Stack spacing={8}>
          <TourneysTable title="Текущие турниры" tourneys={currentTourneys} />
          <TourneysTable title="Прошедшие турниры" tourneys={pastTourneys} />
        </Stack>
      ) : (
        <Center py={10}>
          <Heading fontSize="2xl">Турниры не найдены</Heading>
        </Center>
      )}
    </>
  );
};

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

export default TourneysPage;
