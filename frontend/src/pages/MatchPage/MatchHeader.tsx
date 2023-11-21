import { BoxProps, Heading, Stack } from "@chakra-ui/react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { Match } from "~/types/match";
import { Tourney } from "~/types/tourney";
import { calcMatchName } from "~/utils/match";

type Props = {
  match: Match;
} & BoxProps;

const MatchHeader = ({ match, ...props }: Props) => (
  <Stack spacing={8} {...props}>
    <Breadcrumb items={createBreadcrumbItems(match.tourney)} />
    <Heading fontSize="4xl">Игра "{calcMatchName(match)}"</Heading>
  </Stack>
);

const createBreadcrumbItems = (tourney: Tourney) => [
  { name: "Главная", link: paths.main.path },
  { name: "Турниры", link: paths.tourneys.path },
  { name: tourney.title, link: paths.tourney.path(tourney.id) },
];

export default MatchHeader;
