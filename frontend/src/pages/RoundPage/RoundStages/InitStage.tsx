import { Button, Center, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import TeamCard from "~/components/TeamCard";
import useHandleError from "~/hooks/useHandleError";
import ArrowRightIcon from "~/icons/ArrowRightIcon";
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
      <Center gridArea="main">
        {isOrganizer ? (
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
        ) : (
          <Text
            textAlign="center"
            fontSize={{ base: "lg", md: "2xl" }}
            lineHeight="150%"
            textTransform="uppercase"
          >
            Ожидайте <br /> начало раунда
          </Text>
        )}
      </Center>
    </>
  );
};

export default InitStage;
