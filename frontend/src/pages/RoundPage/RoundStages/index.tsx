import { Box, BoxProps, Grid } from "@chakra-ui/react";
import { RoundState } from "~/types/round";
import { useRoundContext } from "../round-context";
import ChallengesSection from "./ChallengesSection";
import CompleteStage from "./CompleteStage";
import DefenseStage from "./DefenseStage";
import InitStage from "./InitStage";
import MarkStage from "./MarkStage";
import PauseStage from "./PauseStage";
import PrepareStage from "./PrepareStage";
import PresentationStage from "./PresentationStage";

const RoundStages = (props: BoxProps) => {
  const { round, state } = useRoundContext();

  const Stage = (state && STAGES[state]) || InitStage;

  return (
    <Grid
      gridColumnGap={{ base: 3, md: 8 }}
      gridRowGap={{ base: 6, md: 8 }}
      gridTemplateColumns={{
        base: "1fr 1px 1fr",
        xl: "160px 250px 1fr 250px 160px",
      }}
      gridTemplateRows={{
        xl: "repeat(3, min-content) 1fr",
      }}
      gridTemplateAreas={{
        base: [
          '"main main main"',
          '"b b b"',
          '"t1 l t2"',
          '"e1 l e2"',
          '"c1 l c2"',
        ].join(""),
        xl: [
          '"c1 t1 main t2 c2"',
          '"c1 e1 . e2 c2"',
          '"c1 b b b c2"',
          '"c1 . . . c2"',
        ].join(""),
      }}
      justifyItems={{ base: "center", xl: "normal" }}
      {...props}
    >
      <Stage />
      {round.participants.slice(0, 2).map((p, i) => (
        <ChallengesSection
          key={p.teamId}
          gridArea={`c${i + 1}`}
          teamId={p.teamId}
        />
      ))}
      <Box
        my={-4}
        gridArea="l"
        minW="1px"
        bg="blackAlpha.300"
        _dark={{ bg: "whiteAlpha.300" }}
        display={{ base: "inherit", md: "none" }}
      />
    </Grid>
  );
};

const STAGES: Record<RoundState, () => JSX.Element> = {
  [RoundState.Prepare]: PrepareStage,
  [RoundState.Presentation]: PresentationStage,
  [RoundState.Defense]: DefenseStage,
  [RoundState.Mark]: MarkStage,
  [RoundState.Complete]: CompleteStage,
  [RoundState.Pause]: PauseStage,
};

export default RoundStages;
