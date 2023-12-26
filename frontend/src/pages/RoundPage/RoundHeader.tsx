import { Heading, Text } from "@chakra-ui/react";
import Breadcrumb from "~/components/Breadcrumb";
import paths from "~/pages/paths";
import { Tourney } from "~/types/tourney";
import { calcRoundName } from "~/utils/round";
import { useRoundContext } from "./round-context";

const RoundHeader = () => {
  const { isPublic, tourney, round } = useRoundContext();

  return (
    <>
      <Breadcrumb items={createBreadcrumbItems(tourney)} />
      <Heading mt={4} fontSize={{ base: "lg", md: "4xl" }} textAlign="center">
        Игра "{calcRoundName(round, tourney.teams)}"
      </Heading>
      {isPublic && (
        <Text
          mt={4}
          fontSize={{ base: "md", md: "3xl" }}
          fontWeight="bold"
          children={round.specification?.title}
        />
      )}
      {isPublic && (
        <Text
          mt={{ base: 2, sm: 3 }}
          opacity={0.75}
          whiteSpace="pre-line"
          fontSize={{ base: "sm", md: "xl" }}
          lineHeight="130%"
          children={round.specification?.businessDescription}
        />
      )}
    </>
  );
};

const createBreadcrumbItems = (tourney: Tourney) => [
  { name: "Турниры", link: paths.tourneys.path },
  { name: tourney.title, link: paths.tourney.path(tourney.id) },
];

export default RoundHeader;
