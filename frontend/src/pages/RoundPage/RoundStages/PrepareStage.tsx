import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "~/api";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import TeamCard from "~/components/TeamCard";
import useHandleError from "~/hooks/useHandleError";
import { RoundState } from "~/types/round";
import { TourneyTeam } from "~/types/tourney";
import queryKeys from "~/utils/query-keys";
import { useRoundContext } from "../round-context";
import ChallengeSelectionWindow from "./ChallengeSelectionWindow";
import RoundStageTimer from "./RoundStageTimer";
import TimeoutButton from "./TimeoutButton";

const STAGE_COLOR = "#D83161";
const STAGE_STATE = RoundState.Prepare;

const PrepareStage = () => {
  const { getTimerEnd } = useRoundContext();
  const timerEnd = getTimerEnd();

  return timerEnd ? (
    <PrepareEndStage timerEnd={timerEnd} />
  ) : (
    <PrepareStartStage />
  );
};

const PrepareStartStage = () => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, getTeams } = useRoundContext();
  const [currentTeam, setCurrentTeam] = useState<TourneyTeam>();

  const handleChoose = (team: TourneyTeam) => () => setCurrentTeam(team);

  const startMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.start(round.id, STAGE_STATE);
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
            isDisabled={!isOrganizer || startMutation.isPending}
            onClick={handleChoose(team)}
          />
        );
      })}
      <Center gridArea="main">
        <Text
          textAlign="center"
          fontSize="2xl"
          lineHeight="150%"
          textTransform="uppercase"
        >
          Выбор <br />
          дополнительных <br />
          требований
        </Text>
      </Center>
      {isOrganizer && (
        <Stack align="center" gridArea="b">
          <Text textAlign="center" fontSize="md" lineHeight="150%">
            Нажмите на команду, которая будет выбирать
            <br />
            Когда будете готовы - нажмите кнопку ниже
          </Text>
          <Button
            colorScheme="teal"
            isLoading={startMutation.isPending}
            onClick={() => startMutation.mutateAsync()}
            children="Запустить таймер"
          />
        </Stack>
      )}
      {isOrganizer && (
        <ChallengeSelectionWindow
          isOpen={currentTeam !== undefined}
          onClose={() => setCurrentTeam(undefined)}
          team={currentTeam}
        />
      )}
    </>
  );
};

type PrepareEndStageProps = {
  timerEnd: Date;
};

const PrepareEndStage = ({ timerEnd }: PrepareEndStageProps) => {
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isOrganizer, round, getTeams } = useRoundContext();

  const endMutation = useMutation({
    mutationFn: async () => {
      return await api.rounds.end(round.id, STAGE_STATE);
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
        <Text textAlign="center" fontSize="3xl" lineHeight="150%">
          Команды формируют архитектуры
        </Text>
        {isOrganizer && (
          <ButtonWithAlert
            colorScheme="teal"
            isLoading={endMutation.isPending}
            onSubmit={() => endMutation.mutateAsync()}
            buttonText="Перейти к следующему этапу"
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

export default PrepareStage;
