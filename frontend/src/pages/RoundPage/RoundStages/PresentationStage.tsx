import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
const STAGE_STATE = RoundState.Presentation;

const PresentationStage = () => {
  const { getTimerEnd } = useRoundContext();
  const timerEnd = getTimerEnd();

  return timerEnd ? (
    <PresentationEndStage timerEnd={timerEnd} />
  ) : (
    <PresentationStartStage />
  );
};

const PresentationStartStage = () => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, currentTeamId, getTeams, isStateFirstTime } =
    useRoundContext();
  const [chosenTeamId, setChosenTeamId] = useState(currentTeamId);

  const isFirstTime = isStateFirstTime(STAGE_STATE);

  const startMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.start(round.id, STAGE_STATE, chosenTeamId);
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
            gridArea={`t${i + 1}`}
            activeColor={STAGE_COLOR}
            team={team}
            isDisabled={!isFirstTime || !isOrganizer || startMutation.isPending}
            isChosen={chosenTeamId === team.id}
            onChoose={setChosenTeamId}
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
          Подготовка команды к выступлению
        </Text>
      </Center>
      {isOrganizer && (
        <Stack align="center" gridArea="b">
          {isFirstTime && (
            <Text textAlign="center" fontSize="md" lineHeight="150%">
              Нажмите на команду, которая будет выступать
            </Text>
          )}
          <Button
            colorScheme="teal"
            isLoading={startMutation.isPending}
            isDisabled={chosenTeamId === undefined}
            onClick={() => startMutation.mutateAsync()}
            children="Запустить таймер"
          />
        </Stack>
      )}
    </>
  );
};

type PresentationEndStageProps = {
  timerEnd: Date;
};

const PresentationEndStage = ({ timerEnd }: PresentationEndStageProps) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, getTeams, getCurrentTeam } = useRoundContext();

  const currentTeam = getCurrentTeam();

  const endMutation = useMutation({
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
          <TeamCard.Button
            key={team.id}
            isDisabled
            isChosen={currentTeam?.id == team.id}
            activeColor={STAGE_COLOR}
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
          Презентация команды "{currentTeam?.title || "???"}"
        </Text>
        {isOrganizer && (
          <ButtonWithAlert
            colorScheme="teal"
            isLoading={endMutation.isPending}
            onSubmit={() => endMutation.mutateAsync()}
            buttonText="Перейти к защите команды"
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

export default PresentationStage;
