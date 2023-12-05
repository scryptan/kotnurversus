import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/api";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import TeamCard from "~/components/TeamCard";
import useHandleError from "~/hooks/useHandleError";
import { RoundState } from "~/types/round";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";
import RoundStageTimer from "./RoundStageTimer";
import TimeoutButton from "./TimeoutButton";

const STAGE_COLOR = "#F03B36";
const STAGE_STATE = RoundState.Defense;

const DefenseStage = () => {
  const { getTimerEnd } = useRoundContext();
  const timerEnd = getTimerEnd();

  return timerEnd ? (
    <DefenseEndStage timerEnd={timerEnd} />
  ) : (
    <DefenseStartStage />
  );
};

const DefenseStartStage = () => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, currentTeamId, getTeams } = useRoundContext();

  const startMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.start(round.id, STAGE_STATE, currentTeamId);
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
          <TeamCard.Button
            key={team.id}
            isDisabled
            isChosen={currentTeamId === team.id}
            gridArea={`t${i + 1}`}
            activeColor={STAGE_COLOR}
            team={team}
          />
        );
      })}
      <Center gridArea="main">
        <Text
          textAlign="center"
          fontSize={{ base: "lg", md: "2xl" }}
          lineHeight="150%"
          textTransform="uppercase"
        >
          Подготовка команды для защиты
        </Text>
      </Center>
      {isOrganizer && (
        <Button
          gridArea="b"
          justifySelf="center"
          colorScheme="teal"
          isLoading={startMutation.isPending}
          onClick={() => startMutation.mutateAsync()}
          children="Запустить таймер"
        />
      )}
    </>
  );
};

type DefenseEndStageProps = {
  timerEnd: Date;
};

const DefenseEndStage = ({ timerEnd }: DefenseEndStageProps) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, tourney, round, getTeams, isStateFirstTime } =
    useRoundContext();

  const isFirstTime = isStateFirstTime(STAGE_STATE);

  const endMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.end(round.id, STAGE_STATE, currentTeam?.id);
    },
    onSuccess: (round) => {
      queryClient.setQueryData(queryKeys.round(round.id), round);
    },
    onError: handleError,
  });

  const currentTeam = tourney.teams.find(
    (t) => t.id === round.currentState?.value?.teamId
  );

  return (
    <>
      {getTeams().map((team, i) => {
        if (!team) return null;
        return (
          <TeamCard.Button
            isDisabled
            isChosen={currentTeam?.id == team.id}
            activeColor={STAGE_COLOR}
            key={team.id}
            gridArea={`t${i + 1}`}
            team={team}
          />
        );
      })}
      <RoundStageTimer
        gridArea="main"
        alignSelf="center"
        justifySelf="center"
        endDate={timerEnd}
        activeColor={STAGE_COLOR}
      />
      {round.participants.slice(0, 2).map((p, i) => (
        <TimeoutButton
          key={p.teamId}
          gridArea={`e${i + 1}`}
          teamId={p.teamId}
        />
      ))}
      <Stack align="center" gridArea="b">
        <Text
          textAlign="center"
          fontSize={{ base: "xl", md: "3xl" }}
          lineHeight="150%"
        >
          Защита команды "{currentTeam?.title || "???"}"
        </Text>
        {isOrganizer && (
          <ButtonWithAlert
            colorScheme="teal"
            isLoading={endMutation.isPending}
            onSubmit={() => endMutation.mutateAsync()}
            buttonText={
              isFirstTime
                ? "Перейти к презентации другой команды"
                : "Перейти к следующему этапу"
            }
            alertText={[
              "Вы уверены, что хотите перейти к следующему этапу?",
              "Вернуться будет невозможно",
            ].join("\n")}
          />
        )}
      </Stack>
    </>
  );
};

export default DefenseStage;
