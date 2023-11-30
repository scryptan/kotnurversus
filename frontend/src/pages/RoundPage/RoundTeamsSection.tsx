import { Box, BoxProps, Grid, Stack, Text } from "@chakra-ui/react";
import { addSeconds } from "date-fns";
import IconButtonWithTooltip, {
  IconButtonWithTooltipProps,
} from "~/components/IconButtonWithTooltip";
import useTimer from "~/hooks/useTimer";
import NextIcon from "~/icons/NextIcon";
import PauseIcon from "~/icons/PauseIcon";
import { Round } from "~/types/round";
import { Tourney } from "~/types/tourney";

type Props = {
  tourney: Tourney;
  round: Round;
};

const RoundTeamsSection = ({ tourney, round }: Props) => {
  // const [teamA, teamB] = round.participants.map((p) =>
  //   tourney.teams.find((team) => p.teamId === team.id)
  // );

  return (
    <Grid
      gridTemplateAreas={[
        '"teamA main teamB"',
        '"timeoutsA . timeoutsB"',
        '"control control control"',
      ].join("")}
      gridTemplateColumns="1fr 1fr 1fr"
      gridGap={6}
    >
      {/* {(!round.currentState?.state ||
        round.currentState.state === RoundState.None) && (
        <StartRoundCard roundId={round.id} />
      )}
      {round.currentState?.state === RoundState.Prepare && (
        <PrepareCard roundId={round.id} />
      )} */}
      {/* <StartRoundCard roundId={round.id} teamA={teamA} teamB={teamB} /> */}
      {/* <PrepareCard roundId={round.id} teamA={teamA} teamB={teamB} /> */}
      <StateCard tourney={tourney} round={round} justifySelf="center" />
    </Grid>
  );
};

const StateCard = ({ round: _, ...props }: Props & BoxProps) => (
  <Stack spacing={3} align="center" textAlign="center" {...props}>
    <Text
      color="blackAlpha.600"
      _dark={{ color: "whiteAlpha.600" }}
      fontSize="3xl"
      children="стадия"
    />
    <Text
      fontSize="4xl"
      textTransform="uppercase"
      // children={matchStateMap[match.state] || match.state}
    />
    <Timer endDate={addSeconds(new Date(), 75)} />
  </Stack>
);

type TimerProps = {
  endDate: Date;
  onPause?: () => void;
  onResume?: () => void;
  onNext?: () => void;
};

const Timer = ({ endDate, onPause, onResume, onNext }: TimerProps) => {
  const { isRunning, totalSeconds, resume, pause } = useTimer({
    autoStart: false,
    autoStop: false,
    expiryTimestamp: endDate,
  });

  const isNegative = totalSeconds < 0;
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.trunc(totalSeconds / 60);

  const handlePause = () => {
    onPause?.();
    pause();
  };

  const handleResume = () => {
    onResume?.();
    resume();
  };

  return (
    <Box w="220px" pos="relative" fontSize="5xl">
      <TimerButton
        left="-20px"
        label={isRunning ? "Пауза" : "Возобновить"}
        placement="bottom-end"
        onClick={isRunning ? handlePause : handleResume}
        icon={<PauseIcon boxSize="full" />}
      />
      <Text ml={isNegative ? -5 : 0}>
        {isNegative && <Text as="span" children="-" />}
        {Math.abs(totalMinutes).toString().padStart(2, "0")}:
        {Math.abs(seconds).toString().padStart(2, "0")}
      </Text>
      <TimerButton
        right="-20px"
        label="Следующий этап"
        placement="bottom-start"
        onClick={onNext}
        icon={<NextIcon boxSize="full" />}
      />
    </Box>
  );
};

const TimerButton = (props: IconButtonWithTooltipProps) => (
  <IconButtonWithTooltip
    pos="absolute"
    top="14px"
    size="sm"
    variant="unstyled"
    color="blackAlpha.800"
    _hover={{
      color: "blackAlpha.700",
      _dark: { color: "whiteAlpha.700" },
    }}
    _dark={{ color: "whiteAlpha.800" }}
    {...props}
  />
);

// const matchStateMap: Record<TourneyRoundState, string> = {
//   [TourneyRoundState.Init]: "Инициализация",
//   [TourneyRoundState.WalkOver]: "Завершено",
//   [TourneyRoundState.Prepare]: "Подготовка",
//   [TourneyRoundState.Play]: "Презентация",
//   [TourneyRoundState.Defense]: "Защита",
//   [TourneyRoundState.Done]: "Завершено",
// };

export default RoundTeamsSection;
