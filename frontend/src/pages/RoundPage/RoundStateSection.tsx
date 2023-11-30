import { Box, BoxProps, HStack, Text } from "@chakra-ui/react";
import { RoundState } from "~/types/round";

type Props = {
  state?: RoundState;
};

const RoundStateSection = ({ state }: Props) => (
  <HStack spacing={9} justify="center">
    {stateItems.map((item) => (
      <StateCard
        key={item.name}
        name={item.name}
        activeColor={item.activeColor}
        isActive={state && item.state.active.includes(state)}
        isDisabled={!state || item.state.disabled.includes(state)}
      />
    ))}
  </HStack>
);

type StateCardProps = {
  name: string;
  activeColor: string;
  isActive?: boolean;
  isDisabled?: boolean;
} & BoxProps;

const StateCard = ({
  name,
  activeColor,
  isActive,
  isDisabled,
}: StateCardProps) => {
  const withActiveColor = (nonactive: string, active = activeColor) =>
    isActive ? active : nonactive;

  return (
    <Box
      px={4}
      py={2}
      borderRadius={6}
      border="1px solid"
      bg={withActiveColor("blackAlpha.100")}
      borderColor={withActiveColor("blackAlpha.300")}
      _dark={{
        bg: withActiveColor("blackAlpha.500"),
        borderColor: withActiveColor("whiteAlpha.200"),
      }}
    >
      <Text
        fontSize="lg"
        fontWeight="semibold"
        lineHeight="normal"
        opacity={isDisabled && !isActive ? 0.6 : 1}
        color={withActiveColor("text.light.main", "white")}
        _dark={{ color: withActiveColor("text.dark.main", "white") }}
        children={name}
      />
    </Box>
  );
};

const stateItems = [
  {
    name: "Подготовка",
    activeColor: "#D83161",
    state: {
      active: [RoundState.Prepare],
      disabled: [
        RoundState.None,
        RoundState.Presentation,
        RoundState.Defense,
        RoundState.Mark,
        RoundState.Complete,
      ],
    },
  },
  {
    name: "Основной этап",
    activeColor: "#F03B36",
    state: {
      active: [RoundState.Presentation, RoundState.Defense],
      disabled: [RoundState.None, RoundState.Mark, RoundState.Complete],
    },
  },
  {
    name: "Оценка",
    activeColor: "#F0A236",
    state: {
      active: [RoundState.Mark],
      disabled: [RoundState.None, RoundState.Complete],
    },
  },
];

export default RoundStateSection;
