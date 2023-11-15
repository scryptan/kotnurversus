import { Button, Center, Heading, Spinner, Stack } from "@chakra-ui/react";
import { useId } from "react";
import TourneyForm from "~/components/TourneyForm";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";

const CreateTourneyPage = () => {
  const formId = useId();
  const { isAuthenticated } = useAuthContext();

  useAutoRedirect({ isEnabled: !isAuthenticated, path: paths.main.path });

  if (!isAuthenticated) {
    return <Center flex={1} children={<Spinner size="lg" />} />;
  }

  return (
    <Stack mx="auto" w="full" maxW="wrapper" flex={1} spacing={14}>
      <Heading>Создание турнира</Heading>
      <TourneyForm id={formId} onSubmit={console.log} />
      <Button
        ml="360px"
        w="300px"
        form={formId}
        type="submit"
        colorScheme="teal"
        children="Создать турнир"
      />
    </Stack>
  );
};

export default CreateTourneyPage;
