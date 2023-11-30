import { Center, Heading, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "~/api";
import Loading from "~/components/Loading";
import queryKeys from "~/utils/query-keys";
import RoundHeader from "./RoundHeader";
import RoundSpecificationSection from "./RoundSpecificationSection";
import RoundStages from "./RoundStages";
import RoundStateSection from "./RoundStateSection";

type PageParams = {
  roundId: string;
};

const RoundPage = () => {
  const { roundId = "" } = useParams<PageParams>();

  const roundQuery = useQuery({
    queryKey: queryKeys.round(roundId),
    queryFn: () => api.rounds.getById(roundId),
    enabled: Boolean(roundId),
  });

  const tourneyQuery = useQuery({
    queryKey: queryKeys.tourney(roundQuery.data?.gameId),
    queryFn: () => api.tourneys.getById(roundQuery.data?.gameId || ""),
    enabled: Boolean(roundQuery.data?.gameId),
    staleTime: 1000 * 60,
  });

  if (roundQuery.isLoading || tourneyQuery.isLoading) {
    return <Loading flex={1} />;
  }

  if (!roundQuery.data || !tourneyQuery.data) {
    return (
      <Center flex={1}>
        <Heading>Турнир или раунд не найден</Heading>
      </Center>
    );
  }

  const tourney = tourneyQuery.data;
  const round = roundQuery.data;

  return (
    <Stack
      px={2}
      pb={20}
      mx="auto"
      w="full"
      maxW="wrapper"
      flex={1}
      spacing={8}
    >
      <RoundHeader pb={4} tourney={tourney} round={round} />
      <Text
        fontSize="3xl"
        fontWeight="bold"
        textAlign="center"
        children={round.specification.title}
      />
      <RoundStateSection state={round.currentState?.state} />
      <RoundStages tourney={tourney} round={round} />
      <RoundSpecificationSection specification={round.specification} />
    </Stack>
  );
};

export default RoundPage;
