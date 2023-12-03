import {
  BoxProps,
  Button,
  Center,
  HStack,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "~/api";
import Loading from "~/components/Loading";
import TourneysTable from "~/components/TourneysTable";
import OutlinePlusIcon from "~/icons/OutlinePlusIcon";
import paths from "~/pages/paths";
import queryKeys from "~/utils/query-keys";

const TourneysSection = (props: BoxProps) => {
  const tourneysQuery = useQuery({
    queryKey: queryKeys.tourneys,
    queryFn: api.tourneys.find,
    staleTime: 1000 * 60 * 5,
  });

  const tourneys = (tourneysQuery.data?.items || []).sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <Stack {...props} spacing={8}>
      <HStack px={10} justify="space-between">
        <Heading fontSize="3xl" children="Организованные турниры" />
        <CreateTourneyButton />
      </HStack>
      {tourneysQuery.isLoading ? (
        <Loading py={20} />
      ) : tourneys.length > 0 ? (
        <TourneysTable tourneys={tourneys} />
      ) : (
        <Center py={20}>
          <Heading fontSize="xl">Вы ещё не организовывали турниры</Heading>
        </Center>
      )}
    </Stack>
  );
};

const CreateTourneyButton = () => (
  <Button
    as={Link}
    size="lg"
    colorScheme="teal"
    to={paths.createTourney.path}
    leftIcon={<OutlinePlusIcon boxSize={6} />}
    children="Создать турнир"
  />
);

export default TourneysSection;
