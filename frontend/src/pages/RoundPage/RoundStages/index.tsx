import { BoxProps, Grid } from "@chakra-ui/react";
import { RoundState } from "~/types/round";
import { useRoundContext } from "../round-context";
import ChallengesSection from "./ChallengesSection";
import InitStage from "./InitStage";
import PrepareStage from "./PrepareStage";

const RoundStages = (props: BoxProps) => {
  const { round, state } = useRoundContext();

  return (
    <Grid
      gridGap={8}
      gridTemplateColumns="160px 250px 1fr 250px 160px"
      gridTemplateRows="repeat(3, min-content) 1fr"
      gridTemplateAreas={[
        '"c1 t1 main t2 c2"',
        '"c1 to1 . to2 c2"',
        '"c1 b b b c2"',
        '"c1 . . . c2"',
      ].join("")}
      {...props}
    >
      {!state && <InitStage />}
      {state === RoundState.Prepare && <PrepareStage />}
      {/* <InitStage /> */}
      {/* <PrepareStage /> */}
      {round.participants.slice(0, 2).map((p, i) => (
        <ChallengesSection
          key={p.teamId}
          gridArea={`c${i + 1}`}
          teamId={p.teamId}
        />
      ))}
    </Grid>
  );
};

export default RoundStages;
