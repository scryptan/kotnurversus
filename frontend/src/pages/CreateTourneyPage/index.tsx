import { Heading, Stack } from "@chakra-ui/react";
import CreateTourneyForm from "./CreateTourneyForm";

const CreateTourneyPage = () => (
  <Stack mx="auto" w="full" maxW="wrapper" flex={1} spacing={8}>
    <Heading>Создание турнира</Heading>
    <CreateTourneyForm />
  </Stack>
);

export default CreateTourneyPage;
