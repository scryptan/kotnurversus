import { Box, BoxProps, Grid } from "@chakra-ui/react";
import { RoundState } from "~/types/round";
import { useRoundContext } from "../round-context";
import CompleteStage from "./CompleteStage";
import DefenseStage from "./DefenseStage";
import InitStage from "./InitStage";
import MarkStage from "./MarkStage";
import PauseStage from "./PauseStage";
import PrepareStage from "./PrepareStage";
import PresentationStage from "./PresentationStage";
import ChallengesSection from "./components/ChallengesSection";
import RoundStateCard from "./components/RoundStateCard";

const RoundStages = (props: BoxProps) => {
  const { round, state } = useRoundContext();

  const Stage = (state && STAGES[state]) || InitStage;

  return (
    <Grid
      gridColumnGap={{ base: 3, md: 6 }}
      gridRowGap={{ base: 6, md: 6 }}
      gridTemplateColumns={{
        base: "1fr min-content 1fr",
        md: "1fr 175px min-content 175px 1fr",
        xl: "150px 225px 1fr 225px 150px",
      }}
      gridTemplateRows={{
        md: "repeat(3, min-content) 1fr",
      }}
      gridTemplateAreas={{
        base: [
          '"s s s"',
          '"m m m"',
          '"b b b"',
          '"t1 l t2"',
          '"e1 l e2"',
          '"c1 l c2"',
        ].join(""),
        md: [
          '"s s s s s"',
          '"m m m m m"',
          '"b b b b b"',
          '"e1 t1 l t2 e2"',
          '"c1 c1 l c2 c2"',
        ].join(""),
        xl: [
          '"e1 t1 s t2 e2"',
          '"c1 c1 m c2 c2"',
          '"c1 c1 b c2 c2"',
          '"c1 c1 . c2 c2"',
        ].join(""),
      }}
      justifyItems={{ base: "center", xl: "normal" }}
      {...props}
    >
      <RoundStateCard />
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
        display={{ base: "inherit", xl: "none" }}
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
