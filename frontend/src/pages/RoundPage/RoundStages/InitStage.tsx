import { Button, Center } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import TeamCard from "~/components/TeamCard";
import useHandleError from "~/hooks/useHandleError";
import ArrowRightIcon from "~/icons/ArrowRightIcon";
import MainInfo from "~/pages/RoundPage/RoundStages/components/MainInfo";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";

const InitStage = () => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, getTeams } = useRoundContext();

  const initRoundMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.init(round.id);
    },
    onSuccess: async (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  return (
    <>
      {getTeams().map((team, i) => {
        if (!team) return null;
        return (
          <TeamCard.Base key={team.id} gridArea={`t${i + 1}`} team={team} />
        );
      })}
      {isOrganizer ? (
        <Center gridArea="s">
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
      ) : (
        <MainInfo gridArea="s" children="Ожидание игры" />
      )}
    </>
  );
};

export default InitStage;
