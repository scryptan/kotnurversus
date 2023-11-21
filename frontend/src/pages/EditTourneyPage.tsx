import { Button, Center, HStack, Heading, Stack } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "~/api";
import ButtonWithAlert from "~/components/ButtonWithAlert";
import Loading from "~/components/Loading";
import TourneyForm from "~/components/TourneyForm";
import {
  TourneyFormSchema,
  castToCreateTourney,
  castToFormSchema,
} from "~/components/TourneyForm/schema";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import useHandleError from "~/hooks/useHandleError";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import queryKeys from "~/utils/query-keys";

type PageParams = {
  tourneyId: string;
};

const EditTourneyPage = () => {
  const formId = useId();
  const navigate = useNavigate();
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();
  const { tourneyId = "" } = useParams<PageParams>();

  const hasAccess = isAuthenticated && !!tourneyId;

  useAutoRedirect({ isEnabled: !hasAccess, path: paths.main.path });

  const tourneyQuery = useQuery({
    queryKey: queryKeys.tourney(tourneyId),
    queryFn: () => api.tourneys.getById(tourneyId),
    enabled: hasAccess,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const editTourney = useMutation({
    mutationFn: async (data: TourneyFormSchema) => {
      if (!tourneyQuery.isSuccess) return;
      return await api.tourneys.update(
        tourneyQuery.data,
        castToCreateTourney(data)
      );
    },
    onSuccess: async (tourney) => {
      if (tourney) {
        queryClient.setQueryData(queryKeys.tourney(tourney.id), tourney);
      }
      await queryClient.refetchQueries({ queryKey: queryKeys.tourneys });
      navigate(paths.tourney.path(tourney?.id || tourneyId));
    },
    onError: handleError,
  });

  const deleteTourney = useMutation({
    mutationFn: async () => {
      await api.tourneys.delete(tourneyId);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: queryKeys.tourneys });
      navigate(paths.tourneys.path);
      queryClient.setQueryData(queryKeys.tourney(tourneyId), null);
    },
    onError: handleError,
  });

  if (!hasAccess || tourneyQuery.isLoading) {
    return <Loading flex={1} />;
  }

  if (!tourneyQuery.data) {
    return (
      <Center flex={1}>
        <Heading>Турнир не найден</Heading>
      </Center>
    );
  }

  const defaultFormData = castToFormSchema(tourneyQuery.data);

  return (
    <Stack mx="auto" w="full" maxW="wrapper" flex={1} spacing={14}>
      <Heading>Изменение турнира</Heading>
      <TourneyForm
        id={formId}
        defaultValue={defaultFormData}
        onSubmit={editTourney.mutateAsync}
      />
      <HStack ml="365px" spacing={8}>
        <Button
          px={10}
          form={formId}
          type="submit"
          colorScheme="teal"
          isDisabled={deleteTourney.isPending}
          isLoading={editTourney.isPending}
          children="Изменить турнир"
        />
        <ButtonWithAlert
          px={10}
          colorScheme="red"
          isDisabled={editTourney.isPending}
          isLoading={deleteTourney.isPending}
          onSubmit={deleteTourney.mutateAsync}
          buttonText="Удалить турнир"
          alertText="Вы уверены, что хотите удалить данный турнир?"
        />
      </HStack>
    </Stack>
  );
};

export default EditTourneyPage;
