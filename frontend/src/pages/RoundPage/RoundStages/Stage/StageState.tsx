import { Box, BoxProps, Text } from "@chakra-ui/react";
import { RoundState } from "~/types/round";
import { useRoundContext } from "../../round-context";

const StageState = (props: BoxProps) => {
  const context = useRoundContext();

  const state =
    context.state !== RoundState.Pause
      ? context.state
      : context.round.history.findLast(
          (item) => item.state !== RoundState.Pause
        )?.state;

  const info = state ? stateInfo[state] : undefined;

  if (!info) return null;

  const isActive = context.state !== RoundState.Pause;

  const withActiveColor = (nonactive: string, active = info.activeColor) =>
    isActive ? active : nonactive;

  return (
    <Box
      px={4}
      py={2}
      gridArea="s"
      alignSelf="flex-end"
      justifySelf="center"
      h="fit-content"
      w={{ base: "full", md: "fit-content" }}
      minW={{ md: "200px" }}
      maxW="400px"
      borderRadius={6}
      border="1px solid"
      bg={withActiveColor("blackAlpha.100")}
      borderColor={withActiveColor("blackAlpha.300")}
      _dark={{
        bg: withActiveColor("blackAlpha.500"),
        borderColor: withActiveColor("whiteAlpha.200"),
      }}
      {...props}
    >
      <Text
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="semibold"
        lineHeight="normal"
        textAlign="center"
        color={withActiveColor("text.light.main", "white")}
        _dark={{ color: withActiveColor("text.dark.main", "white") }}
        children={info.name}
      />
    </Box>
  );
};

type StateInfo = {
  name: string;
  activeColor: string;
};

const stateInfo: Record<RoundState, StateInfo | undefined> = {
  [RoundState.Prepare]: {
    name: "Подготовка",
    activeColor: "#D83161",
  },
  [RoundState.Presentation]: {
    name: "Основной этап",
    activeColor: "#F03B36",
  },
  [RoundState.Defense]: {
    name: "Основной этап",
    activeColor: "#F03B36",
  },
  [RoundState.Mark]: {
    name: "Оценка",
    activeColor: "#F0A236",
  },
  [RoundState.Complete]: {
    name: "Завершен",
    activeColor: "#38A169",
  },
  [RoundState.Pause]: undefined,
};

export default StageState;
