import { Flex, Heading, Image } from "@chakra-ui/react";
import laptopLink from "assets/laptop.png";

const MainPage = () => {
  return (
    <Flex
      mx="auto"
      w="full"
      maxW="wrapper"
      px={4}
      flex={1}
      flexDir={{ base: "column", md: "row" }}
      align="center"
      justify={{ base: "space-evenly", md: "space-between" }}
    >
      <Heading
        fontSize={{ base: "3xl", md: "4xl", lg: "6xl" }}
        textAlign={{ base: "center", md: "left" }}
      >
        Проведем
        <br />
        архитектурный
        <br />
        баттл
      </Heading>
      <Image
        m={{ base: 6, md: 0 }}
        w={{ base: "65%", md: "48%" }}
        objectFit="contain"
        pointerEvents="none"
        src={laptopLink}
      />
    </Flex>
  );
};

export default MainPage;
