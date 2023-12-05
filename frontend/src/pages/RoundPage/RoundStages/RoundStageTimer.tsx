import { BoxProps, Center, Text, useDisclosure } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import Alert from "~/components/Alert";
import IconButtonWithTooltip from "~/components/IconButtonWithTooltip";
import useHandleError from "~/hooks/useHandleError";
import useTimer from "~/hooks/useTimer";
import ResetIcon from "~/icons/ResetIcon";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";

type Props = {
  endDate: Date;
  activeColor: string;
} & BoxProps;

const RoundStageTimer = ({ endDate, activeColor, ...props }: Props) => {
  const { isOrganizer } = useRoundContext();
  const { isRunning, totalSeconds } = useTimer({
    autoStart: true,
    autoStop: false,
    expiryTimestamp: endDate,
  });

  const isNegative = totalSeconds < 0;
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.trunc(totalSeconds / 60);

  const activeProps = {
    borderColor: activeColor,
    boxShadow: `0px 0px 20px 0px ${activeColor}`,
  };

  return (
    <Center
      py={2}
      mb={{ md: 4 }}
      w="200px"
      borderRadius={8}
      border="1px solid transparent"
      fontSize="5xl"
      flexDir="column"
      {...(isRunning ? activeProps : {})}
      {...props}
    >
      {isOrganizer && <ResetTimerButton />}
      {Math.abs(totalMinutes) < 1000 ? (
        <Text
          ml={isNegative ? -4 : 0}
          color={isNegative ? "secondary" : "inherit"}
          userSelect="none"
          pointerEvents="none"
        >
          {isNegative && <Text as="span" children="-" />}
          {Math.abs(totalMinutes).toString().padStart(2, "0")}:
          {Math.abs(seconds).toString().padStart(2, "0")}
        </Text>
      ) : (
        <Text children="∞" />
      )}
    </Center>
  );
};

const ResetTimerButton = () => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { round } = useRoundContext();
  const alert = useDisclosure();

  const resetTimerMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.resetTimer(round.id);
    },
    onSuccess: (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  const handleSubmit = async () => {
    await resetTimerMutation.mutateAsync();
    alert.onClose();
  };

  return (
    <>
      <IconButtonWithTooltip
        size="md"
        variant="link"
        label="Сбросить таймер"
        icon={<ResetIcon boxSize={8} />}
        isDisabled={resetTimerMutation.isPending}
        onClick={alert.onOpen}
      />
      <Alert
        isOpen={alert.isOpen}
        isLoading={resetTimerMutation.isPending}
        onClose={alert.onClose}
        onSubmit={handleSubmit}
        children="Вы уверены, что хотите перезапустить таймер для текущего этапа?"
      />
    </>
  );
};

export default RoundStageTimer;
