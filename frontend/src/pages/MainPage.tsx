import { Flex, Heading, Image } from "@chakra-ui/react";
import laptopLink from "assets/laptop.png";

const MainPage = () => (
  <Flex
    mx="auto"
    w="full"
    maxW="wrapper"
    px={4}
    flex={1}
    align="center"
    justify="space-between"
  >
    <Heading fontSize="6xl">
      Проведем
      <br />
      архитектурный
      <br />
      баттл
    </Heading>
    <Image w="48%" objectFit="contain" pointerEvents="none" src={laptopLink} />
  </Flex>
);

export default MainPage;
