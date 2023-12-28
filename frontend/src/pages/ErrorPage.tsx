import { Button, Center, Heading, Stack, Text } from "@chakra-ui/react";
import paths from "~/pages/paths";

const ErrorPage = () => (
  <Center
    px={4}
    mx="auto"
    w="full"
    maxW="wrapper"
    h="full"
    flexDir="column"
    textAlign="center"
  >
    <Heading fontSize={{ base: "xl", md: "3xl", lg: "5xl" }}>
      Упс! Что-то пошло не так...
    </Heading>
    <Text mt={4} fontSize={{ base: "md", md: "lg", lg: "xl" }}>
      Попробуйте перезагрузить страницу или зайти чуть позже
    </Text>
    <Stack
      mt={20}
      spacing={{ base: 4, md: 8 }}
      direction={{ base: "column", md: "row" }}
    >
      <Button
        size={{ base: "sm", md: "lg" }}
        onClick={() => location?.reload?.()}
      >
        Перезагрузить страницу
      </Button>
      <Button
        colorScheme="teal"
        size={{ base: "sm", md: "lg" }}
        onClick={() => location?.assign?.(paths.tourneys.path)}
      >
        Вернуться к турнирам
      </Button>
    </Stack>
  </Center>
);

export default ErrorPage;
