import { BoxProps, Center, IconButton, Text, useToast } from "@chakra-ui/react";
import useTimer from "~/hooks/useTimer";
import ResetIcon from "~/icons/ResetIcon";
import { errorToast } from "~/utils/template-toasts";

type Props = {
  endDate: Date;
  activeColor: string;
} & BoxProps;

const RoundStageTimer = ({ endDate, activeColor, ...props }: Props) => {
  const toast = useToast();
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
      mb={4}
      w="200px"
      borderRadius={8}
      border="1px solid transparent"
      fontSize="5xl"
      flexDir="column"
      {...(isRunning ? activeProps : {})}
      {...props}
    >
      <IconButton
        size="md"
        variant="link"
        aria-label="Сбросить таймер"
        icon={<ResetIcon boxSize={8} />}
        // TODO реализовать
        onClick={() => toast(errorToast("Не реализовано"))}
      />
      <Text ml={isNegative ? -4 : 0} userSelect="none" pointerEvents="none">
        {isNegative && <Text as="span" children="-" />}
        {Math.abs(totalMinutes).toString().padStart(2, "0")}:
        {Math.abs(seconds).toString().padStart(2, "0")}
      </Text>
    </Center>
  );
};

export default RoundStageTimer;
