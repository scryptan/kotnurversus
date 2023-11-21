import { Button, Heading, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { useNavigate } from "react-router-dom";
import api from "~/api";
import Loading from "~/components/Loading";
import TourneyForm from "~/components/TourneyForm";
import { TourneyFormSchema } from "~/components/TourneyForm/schema";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import useHandleError from "~/hooks/useHandleError";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import { setTimeToDate } from "~/utils/time";

const CreateTourneyPage = () => {
  const formId = useId();
  const navigate = useNavigate();
  const handleError = useHandleError();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();

  useAutoRedirect({ isEnabled: !isAuthenticated, path: paths.main.path });

  const createTourney = useMutation({
    mutationFn: async (data: TourneyFormSchema) => {
      const tourney = await api.tourneys.create({
        title: data.name,
        form: data.type,
        startDate: setTimeToDate(data.day, data.time),
        description: data.description,
      });
      navigate(paths.tourney.path(tourney.id));
      return tourney;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: api.tourneys.queryKeys.find() });
    },
    onError: handleError,
  });

  if (!isAuthenticated) {
    return <Loading flex={1} />;
  }

  return (
    <Stack mx="auto" w="full" maxW="wrapper" flex={1} spacing={14}>
      <Heading>Создание турнира</Heading>
      <TourneyForm id={formId} onSubmit={createTourney.mutateAsync} />
      <Button
        px={10}
        ml="360px"
        w="fit-content"
        form={formId}
        type="submit"
        colorScheme="teal"
        isLoading={createTourney.isPending}
        children="Создать турнир"
      />
    </Stack>
  );
};

export default CreateTourneyPage;
