import { BoxProps, Button, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import useHandleError from "~/hooks/useHandleError";
import { RoundState } from "~/types/round";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";

type Props = {
  teamId: string;
} & BoxProps;

const TimeoutButton = ({ teamId, ...props }: Props) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { round } = useRoundContext();

  const timeoutsSpent = round.history.filter(
    (s) => s.state === RoundState.Pause && s.value?.teamId === teamId
  ).length;

  const maxTimeouts = round.settings.timeoutsCount;
  const leftTimeouts = Math.max(0, maxTimeouts - timeoutsSpent);

  const startTimeoutMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.start(round.id, RoundState.Pause, teamId);
    },
    onSuccess: (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  return (
    <Stack px={10} spacing={2} {...props}>
      <Button
        colorScheme="gray"
        children="Взять таймаут"
        isDisabled={leftTimeouts < 1}
        isLoading={startTimeoutMutation.isPending}
        onClick={() => startTimeoutMutation.mutateAsync()}
      />
      <Text textAlign="center" fontSize="sm">
        Осталось {leftTimeouts} из {maxTimeouts}
      </Text>
    </Stack>
  );
};

export default TimeoutButton;
