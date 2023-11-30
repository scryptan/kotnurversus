import { BoxProps, Heading, Stack, Text } from "@chakra-ui/react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { Tourney } from "~/types/tourney";
import { calcRoundName } from "~/utils/round";
import { useRoundContext } from "./round-context";

const RoundHeader = (props: BoxProps) => {
  const { tourney, round } = useRoundContext();

  return (
    <Stack spacing={8} {...props}>
      <Breadcrumb items={createBreadcrumbItems(tourney)} />
      <Heading fontSize="4xl">
        Игра "{calcRoundName(round, tourney.teams)}"
      </Heading>
      <Text
        pt={4}
        fontSize="3xl"
        fontWeight="bold"
        textAlign="center"
        children={round.specification.title}
      />
    </Stack>
  );
};

const createBreadcrumbItems = (tourney: Tourney) => [
  { name: "Главная", link: paths.main.path },
  { name: "Турниры", link: paths.tourneys.path },
  { name: tourney.title, link: paths.tourney.path(tourney.id) },
];

export default RoundHeader;
