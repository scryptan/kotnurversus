import { Button, Heading, Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import TeamCard from "~/components/TeamCard";
import useHandleError from "~/hooks/useHandleError";
import { RoundState } from "~/types/round";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";
import RoundStageTimer from "./RoundStageTimer";

const STAGE_COLOR = "#38B2AC";
const STAGE_STATE = RoundState.Pause;

const PauseStage = () => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, getTeams, getCurrentTeam, getTimerEnd } =
    useRoundContext();

  const currentTeam = getCurrentTeam();
  const timerEnd = getTimerEnd();

  const endTimeoutMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.end(round.id, STAGE_STATE, currentTeam?.id);
    },
    onSuccess: (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  return (
    <>
      {getTeams().map((team, i) => {
        if (!team) return null;
        return (
          <TeamCard.Base key={team.id} gridArea={`t${i + 1}`} team={team} />
        );
      })}
      {timerEnd && (
        <RoundStageTimer
          gridArea="main"
          alignSelf="center"
          justifySelf="center"
          endDate={timerEnd}
          activeColor={STAGE_COLOR}
        />
      )}
      <Stack align="center" gridArea="b">
        <Heading
          textAlign="center"
          fontSize={{ base: "xl", md: "4xl" }}
          lineHeight="150%"
        >
          Таумаут команды "{currentTeam?.title || "???"}"
        </Heading>
        {isOrganizer && (
          <Button
            colorScheme="teal"
            isLoading={endTimeoutMutation.isPending}
            onClick={() => endTimeoutMutation.mutateAsync()}
            children="Закончить таймаут"
          />
        )}
      </Stack>
    </>
  );
};

export default PauseStage;
