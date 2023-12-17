import { Box, BoxProps, Text, forwardRef } from "@chakra-ui/react";
import { MouseEvent } from "react";
import { useRoundContext } from "~/pages/RoundPage/round-context";
import { TourneyTeam } from "~/types/tourney";

type Props = {
  isChosen?: boolean;
  isDisabled?: boolean;
  activeColor?: string;
  team?: TourneyTeam;
  onChoose?: (teamId: string) => void;
  onClick?: () => void;
} & BoxProps;

const StageTeam = ({
  isChosen,
  isDisabled,
  activeColor,
  onChoose,
  onClick,
  team,
  ...props
}: Props) => {
  const { round } = useRoundContext();

  if (!team) return null;

  const isFirstTeam = round.participants.at(0)?.teamId === team.id;

  const containerBaseProps = {
    w: "full",
    maxW: "225px",
    alignSelf: "flex-end",
    justifySelf: isFirstTeam ? "flex-end" : "flex-start",
  };
  const hoverProps = {
    borderColor: activeColor,
    _dark: { borderColor: activeColor },
  };
  const activeProps = {
    ...hoverProps,
    boxShadow: `0px 0px 10px 0px ${activeColor}`,
  };

  if (isDisabled || !activeColor) {
    return (
      <BaseTeam
        team={team}
        bodyProps={isChosen && activeColor ? activeProps : undefined}
        {...containerBaseProps}
        {...props}
      />
    );
  }

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClick) return onClick(e);
    if (team.id) return onChoose?.(team.id);
  };

  return (
    <BaseTeam
      as="button"
      outline="none"
      team={team}
      _hover={{ "#team-body": hoverProps }}
      _focusVisible={{ "#team-body": hoverProps }}
      onClick={handleClick}
      bodyProps={{
        transition: ["border", "box-shadow"]
          .map((x) => `${x} 200ms ease-out`)
          .join(", "),
        ...(isChosen ? activeProps : {}),
      }}
      {...containerBaseProps}
      {...props}
    />
  );
};

type BaseTeamProps = {
  team: TourneyTeam;
  bodyProps?: BoxProps;
} & BoxProps;

const BaseTeam = forwardRef<BaseTeamProps, "div">(
  ({ team, bodyProps, _dark, ...props }, ref) => (
    <Box ref={ref} textAlign="center" {...props}>
      <Text
        my={1}
        opacity={0.75}
        fontSize={{ base: "xs", sm: "sm" }}
        children="Команда"
      />
      <Box
        id="team-body"
        px={4}
        py={2}
        w="full"
        h="fit-content"
        border="1px solid"
        bg="blackAlpha.50"
        borderColor="blackAlpha.50"
        borderRadius={8}
        {...bodyProps}
        _dark={{
          bg: "whiteAlpha.50",
          borderColor: "whiteAlpha.50",
          ...bodyProps?._dark,
        }}
      >
        <Text
          fontSize={{ base: "sm", sm: "lg" }}
          fontWeight="medium"
          noOfLines={1}
          wordBreak="break-all"
          children={team.title}
        />
      </Box>
    </Box>
  )
);

export default StageTeam;
