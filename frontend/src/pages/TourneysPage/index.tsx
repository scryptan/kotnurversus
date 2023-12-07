import {
  Button,
  Center,
  HStack,
  Heading,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import api from "~/api";
import Input from "~/components/Input";
import Loading from "~/components/Loading";
import useDebounce from "~/hooks/useDebounce";
import OutlinePlusIcon from "~/icons/OutlinePlusIcon";
import SearchIcon from "~/icons/SearchIcon";
import paths from "~/pages/paths";
import { TourneyState } from "~/types/tourney";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";
import TourneysTable from "./TourneysTable";

const TourneysPage = () => (
  <Stack
    mx="auto"
    px={2}
    w="full"
    maxW="wrapper"
    flex={1}
    spacing={{ base: 6, md: 10 }}
  >
    <HStack justify={{ base: "center", md: "space-between" }}>
      <Heading
        fontSize={{ base: "lg", md: "2xl", lg: "4xl" }}
        textAlign={{ base: "center", md: "left" }}
        children="Турниры по архитектуре приложений"
      />
      <CreateTourneyButton />
    </HStack>
    <TourneysSection />
  </Stack>
);

const TourneysSection = () => {
  const debounce = useDebounce(300);
  const [searchValue, setSearchValue] = useState("");

  const tourneysQuery = useQuery({
    queryKey: queryKeys.tourneys,
    queryFn: api.tourneys.find,
    staleTime: 1000 * 60 * 5,
  });

  const tourneys = (tourneysQuery.data?.items || [])
    .filter((t) => t.title.toLowerCase().includes(searchValue))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const currentTourneys = tourneys.filter(
    (t) => t.state !== TourneyState.Complete
  );
  const pastTourneys = tourneys.filter(
    (t) => t.state === TourneyState.Complete
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim().toLowerCase();
    debounce.set(() => setSearchValue(value));
  };

  return (
    <>
      <Input
        size={{ base: "sm", md: "lg" }}
        onChange={handleSearch}
        placeholder="Поиск по названию турнира"
        rightElement={<SearchIcon boxSize={{ base: 4, md: 6 }} />}
        rightElementProps={{ pointerEvents: "none" }}
        containerProps={{ mx: "auto", w: { base: "90%", md: "70%" } }}
      />
      {tourneysQuery.isLoading ? (
        <Loading py={10} />
      ) : currentTourneys.length > 0 || pastTourneys.length > 0 ? (
        <Stack spacing={{ base: 6, md: 8 }}>
          <TourneysTable title="Текущие турниры" tourneys={currentTourneys} />
          <TourneysTable title="Прошедшие турниры" tourneys={pastTourneys} />
        </Stack>
      ) : (
        <Center py={10}>
          <Heading fontSize={{ base: "lg", md: "2xl" }}>
            Турниры не найдены
          </Heading>
        </Center>
      )}
    </>
  );
};

const CreateTourneyButton = () => {
  const { isAuthenticated } = useAuthContext();
  const [isDesktop] = useMediaQuery("(min-width: 48em)");

  if (!(isAuthenticated && isDesktop)) {
    return null;
  }

  return (
    <Button
      as={Link}
      size="lg"
      colorScheme="teal"
      to={paths.createTourney.path}
      leftIcon={<OutlinePlusIcon boxSize={6} />}
      children="Создать турнир"
    />
  );
};

export default TourneysPage;
