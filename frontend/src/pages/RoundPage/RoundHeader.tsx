import { Heading, Text } from "@chakra-ui/react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { Tourney } from "~/types/tourney";
import { calcRoundName } from "~/utils/round";
import { useRoundContext } from "./round-context";
import RoundStateSection from "./RoundStateSection";

const RoundHeader = () => {
  const { isPublic, tourney, round } = useRoundContext();

  return (
    <>
      <Breadcrumb items={createBreadcrumbItems(tourney)} />
      <Heading mt={8} fontSize="4xl">
        Игра "{calcRoundName(round, tourney.teams)}"
      </Heading>
      {isPublic && (
        <Text
          mt={12}
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          children={round.specification.title}
        />
      )}
      <RoundStateSection mt={isPublic ? 4 : 16} />
    </>
  );
};

const createBreadcrumbItems = (tourney: Tourney) => [
  { name: "Главная", link: paths.main.path },
  { name: "Турниры", link: paths.tourneys.path },
  { name: tourney.title, link: paths.tourney.path(tourney.id) },
];

export default RoundHeader;
