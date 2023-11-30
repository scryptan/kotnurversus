import { BoxProps, Heading, Stack } from "@chakra-ui/react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { Round } from "~/types/round";
import { Tourney } from "~/types/tourney";
import { calcRoundName } from "~/utils/round";

type Props = {
  tourney: Tourney;
  round: Round;
} & BoxProps;

const RoundHeader = ({ tourney, round, ...props }: Props) => (
  <Stack spacing={8} {...props}>
    <Breadcrumb items={createBreadcrumbItems(tourney)} />
    <Heading fontSize="4xl">Игра "{calcRoundName(round, tourney.teams)}"</Heading>
  </Stack>
);

const createBreadcrumbItems = (tourney: Tourney) => [
  { name: "Главная", link: paths.main.path },
  { name: "Турниры", link: paths.tourneys.path },
  { name: tourney.title, link: paths.tourney.path(tourney.id) },
];

export default RoundHeader;
