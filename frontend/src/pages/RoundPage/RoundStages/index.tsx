import { Grid } from "@chakra-ui/react";
import { Round } from "~/types/round";
import { Tourney } from "~/types/tourney";
import InitStage from "./InitStage";

type Props = {
  tourney: Tourney;
  round: Round;
};

const RoundStages = ({ tourney, round }: Props) => {
  const [teamA, teamB] = round.participants.map((p) =>
    tourney.teams.find((team) => p.teamId === team.id)
  );

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
        <InitStage roundId={round.id} teamA={teamA} teamB={teamB} />
      )}
      {round.currentState?.state === RoundState.Prepare && (
        <PrepareStage roundId={round.id} teamA={teamA} teamB={teamB} />
      )} */}
      <InitStage roundId={round.id} teamA={teamA} teamB={teamB} />
      {/* <PrepareStage roundId={round.id} teamA={teamA} teamB={teamB} /> */}
    </Grid>
  );
};

export default RoundStages;
