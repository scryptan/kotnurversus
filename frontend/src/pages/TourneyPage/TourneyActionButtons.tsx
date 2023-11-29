import { Button, HStack, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import api from "~/api";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import PenIcon from "~/icons/PenIcon";
import UnlockIcon from "~/icons/UnlockIcon";
import paths from "~/pages/paths";
import { Tourney } from "~/types/tourney";
import { addSpecificationToRound } from "~/utils/match";
import queryKeys from "~/utils/query-keys";
import { castToCreateRound } from "~/utils/round";
import { warningToast } from "~/utils/template-toasts";
import { createMatchesFromTeams } from "~/utils/tourney";
import { useTourneyContext } from "./tourney-context";

type Props = {
  tourney: Tourney;
};

const TourneyActionButtons = ({ tourney }: Props) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { isEditable } = useTourneyContext();

  const startTourney = useMutation({
    mutationFn: async () => {
      const rounds = createMatchesFromTeams(tourney.teams)
        .map(addSpecificationToRound(tourney.specifications))
        .map(castToCreateRound(tourney.id));

      if (rounds.length < 2) {
        throw new Error("Недостаточно команд для начала раунда");
      }

      return await api.tourneys.start(tourney.id, rounds);
    },
    onSuccess: async (tourney) => {
      queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
      await queryClient.refetchQueries({ queryKey: queryKeys.tourneys });
    },
    onError: (error) => {
      let message = "Не удалось начать раунд :(";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error?.message) {
        message = error?.message || message;
      }
      toast(warningToast(message));
    },
  });

  if (!isEditable) return null;

  return (
    <HStack spacing={4}>
      <Button
        as={Link}
        isDisabled={startTourney.isPending}
        to={paths.editTourney.path(tourney.id)}
        rightIcon={<PenIcon boxSize={6} />}
        children="Редактировать турнир"
      />
      <ButtonWithAlert
        closeBeforeSubmit
        colorScheme="teal"
        isLoading={startTourney.isPending}
        rightIcon={<UnlockIcon boxSize={6} />}
        onSubmit={startTourney.mutate}
        alertText="Вы уверены, что хотите начать турнир? Редактирование настроек будет недоступно"
        buttonText="Начать турнир"
      />
    </HStack>
  );
};

export default TourneyActionButtons;
