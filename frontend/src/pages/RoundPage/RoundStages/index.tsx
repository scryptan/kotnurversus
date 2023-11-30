import { Grid } from "@chakra-ui/react";
import { RoundState } from "~/types/round";
import { useRoundContext } from "../round-context";
import ChallengesSection from "./ChallengesSection";
import InitStage from "./InitStage";
import PrepareStage from "./PrepareStage";

const RoundStages = () => {
  const { round, state } = useRoundContext();

  return (
    <Grid
      gridGap={8}
      gridTemplateColumns="160px 250px 1fr 250px 160px"
      gridTemplateAreas={[
        '"c1 teamA main teamB c2"',
        '"c1 timeoutsA . timeoutsB c2"',
        '"c1 control control control c2"',
        '"c1 . . . c2"',
      ].join("")}
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
