import { BoxProps, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { errorToast } from "~/utils/template-toasts";
import { useRoundContext } from "../round-context";

type Props = {
  teamId: string;
} & BoxProps;

const TimeoutButton = ({ teamId: _, ...props }: Props) => {
  const toast = useToast();
  const { round } = useRoundContext();

  const maxTimeouts = round.settings.timeoutsCount;
  const leftTimeouts = maxTimeouts;

  return (
    <Stack px={10} spacing={2} {...props}>
      <Button
        colorScheme="gray"
        children="Взять таймаут"
        // TODO: реализовать
        onClick={() => toast(errorToast("Не реализовано"))}
      />
      <Text textAlign="center" fontSize="sm">
        Осталось {leftTimeouts} из {maxTimeouts}
      </Text>
    </Stack>
  );
};

export default TimeoutButton;
