import {
  BoxProps,
  Button,
  Center,
  HStack,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import TourneysTable from "~/components/TourneysTable";
import PlusIcon from "~/icons/PlusIcon";
import paths from "~/pages/paths";
import { Tourney, TourneyType } from "~/types/tourney";

const TourneysSection = (props: BoxProps) => {
  const tourneys = useRef(mockTourneys);

  return (
    <Stack {...props} spacing={8}>
      <HStack px={10} justify="space-between">
        <Heading fontSize="3xl" children="Организованные турниры" />
        <CreateTourneyButton />
      </HStack>
      {tourneys.current.length > 0 ? (
        <TourneysTable tourneys={tourneys.current} />
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
    leftIcon={<PlusIcon boxSize={6} />}
    children="Создать турнир"
  />
);

const mockTourneys: Tourney[] = [...Array(5)].map((_, i) => ({
  id: i + 1,
  name: `Турнир ${i + 1}`,
  startDate: new Date(),
  type: TourneyType.Offline,
}));

export default TourneysSection;
