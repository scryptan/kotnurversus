import { BoxProps, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import useHandleError from "~/hooks/useHandleError";
import { useRoundContext } from "~/pages/RoundPage/round-context";
import { RoundState } from "~/types/round";
import queryKeys from "~/utils/query-keys";

type Props = {
  teamId: string;
} & BoxProps;

const StageTimeout = ({ teamId, ...props }: Props) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round } = useRoundContext();

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

  if (isOrganizer) {
    return (
      <Button
        py={2}
        h="fit-content"
        colorScheme="gray"
        isDisabled={leftTimeouts < 1}
        isLoading={startTimeoutMutation.isPending}
        onClick={() => startTimeoutMutation.mutateAsync()}
        whiteSpace="normal"
        flexDir="column"
        alignSelf="flex-end"
        gap={1}
      >
        <Heading fontSize={{ base: "sm", sm: "md" }} children="Таймаут" />
        <Text
          fontSize={{ base: "xs", sm: "sm" }}
          fontWeight="normal"
          opacity={0.75}
        >
          Осталось {leftTimeouts} из {maxTimeouts}
        </Text>
      </Button>
    );
  }

  return (
    <Flex
      gap={1}
      textAlign="center"
      flexDir="column"
      justify="center"
      {...props}
    >
      <Heading fontSize={{ base: "sm", sm: "md" }} children="Таймаут" />
      <Text fontSize={{ base: "xs", sm: "sm" }} opacity={0.75}>
        Осталось {leftTimeouts} из {maxTimeouts}
      </Text>
    </Flex>
  );
};

export default StageTimeout;
