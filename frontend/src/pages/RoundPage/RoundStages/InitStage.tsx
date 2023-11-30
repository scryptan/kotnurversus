import { Button, Center } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import TeamCard from "~/components/TeamCard";
import useHandleError from "~/hooks/useHandleError";
import ArrowRightIcon from "~/icons/ArrowRightIcon";
import { TourneyTeam } from "~/types/tourney";
import queryKeys from "~/utils/query-keys";

type Props = {
  roundId: string;
  teamA?: TourneyTeam;
  teamB?: TourneyTeam;
};

const InitStage = ({ roundId, teamA, teamB }: Props) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();

  const initRoundMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.init(roundId);
    },
    onSuccess: async (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  return (
    <>
      {teamA && (
        <TeamCard.Base gridArea="teamA" team={teamA} justifySelf="flex-end" />
      )}
      <Center gridArea="main">
        <Button
          size="lg"
          variant="outline"
          color="secondary"
          borderColor="secondary"
          children="Начать игру"
          rightIcon={<ArrowRightIcon />}
          _hover={{ bg: "#f03b360f" }}
          isLoading={initRoundMutation.isPending}
          onClick={() => initRoundMutation.mutateAsync()}
        />
      </Center>
      {teamB && <TeamCard.Base gridArea="teamB" team={teamB} />}
    </>
  );
};

export default InitStage;
