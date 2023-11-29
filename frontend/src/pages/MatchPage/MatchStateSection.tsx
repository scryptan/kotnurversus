import { Box, BoxProps, Grid, Spacer, Stack, Text } from "@chakra-ui/react";
import { addSeconds } from "date-fns";
import IconButtonWithTooltip, {
  IconButtonWithTooltipProps,
} from "~/components/IconButtonWithTooltip";
import TeamCard from "~/components/TeamCard";
import useTimer from "~/hooks/useTimer";
import NextIcon from "~/icons/NextIcon";
import PauseIcon from "~/icons/PauseIcon";
import { Match, TourneyRoundState } from "~/types/match";

type Props = {
  match: Match;
};

const MatchStateSection = ({ match }: Props) => {
  const [teamA, teamB] = match.teams;

  return (
    <Grid gridTemplateColumns="1fr 1.5fr 1fr" gridGap={6}>
      {teamA ? <TeamCard team={teamA} justifySelf="flex-end" /> : <Spacer />}
      <StateCard match={match} justifySelf="center" />
      {teamB ? <TeamCard team={teamB} /> : <Spacer />}
    </Grid>
  );
};

const StateCard = ({ match, ...props }: Props & BoxProps) => (
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
      children={matchStateMap[match.state] || match.state}
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

const matchStateMap: Record<TourneyRoundState, string> = {
  [TourneyRoundState.Init]: "Инициализация",
  [TourneyRoundState.WalkOver]: "Завершено",
  [TourneyRoundState.Prepare]: "Подготовка",
  [TourneyRoundState.Play]: "Презентация",
  [TourneyRoundState.Defense]: "Защита",
  [TourneyRoundState.Done]: "Завершено",
};

export default MatchStateSection;
