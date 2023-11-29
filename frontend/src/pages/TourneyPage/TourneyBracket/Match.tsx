import {
  Box,
  Center,
  Flex,
  FlexProps,
  Skeleton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MatchComponentProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { Link } from "react-router-dom";
import paths from "~/pages/paths";
import { TourneyRoundState } from "~/types/tourney";

const Match = ({
  match,
  topWon,
  topParty,
  bottomParty,
  bottomWon,
}: MatchComponentProps) => {
  const { colorMode } = useColorMode();

  const isLoading = "isLoading" in match ? Boolean(match.isLoading) : false;

  const isInit = match.state === TourneyRoundState.Init;
  const isDone = match.state === TourneyRoundState.Complete;
  const borderColor =
    colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300";

  const linkProps = !isInit
    ? {
        as: Link,
        to: paths.match.path(match.id),
        cursor: "pointer",
        transition: "opacity 200ms ease-out",
        _hover: { opacity: 0.75 },
      }
    : {};

  return (
    <Skeleton
      ml={3}
      my={5}
      h="calc(100% - 40px)"
      borderRadius={4}
      isLoaded={!isLoading}
      startColor={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"}
      endColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
    >
      <Flex
        h="full"
        border="1px solid"
        borderColor={borderColor}
        bg={`bg.${colorMode}.2`}
        flexDir="column"
        justify="space-between"
        borderRadius={4}
        {...linkProps}
      >
        <Side
          isDone={isDone}
          isWon={topWon}
          name={topParty.name}
          resultText={topParty.resultText}
        />
        <Box border="1px solid" borderColor="inherit" />
        <Side
          isDone={isDone}
          isWon={bottomWon}
          name={bottomParty.name}
          resultText={bottomParty.resultText}
        />
        {"specification" in match && (
          <SpecificationLabel value={match.specification?.title} />
        )}
        {"badgeValue" in match && <Badge value={match.badgeValue} />}
      </Flex>
    </Skeleton>
  );
};

type SideProps = {
  isWon?: boolean;
  isDone?: boolean;
  name?: string;
  resultText?: string | null;
} & FlexProps;

const Side = ({ isWon, isDone, name, resultText, ...props }: SideProps) => {
  const hasName = name && name != "TBD";

  return (
    <Flex
      h="full"
      align="center"
      justify="space-between"
      opacity={!isWon && isDone ? 0.5 : 1}
      _first={{
        borderBottom: "none",
        borderTopRadius: 4,
        ".score": { borderTopRightRadius: 4 },
      }}
      _last={{
        borderTop: "none",
        borderBottomRadius: 4,
        ".score": { borderBottomRightRadius: 4 },
      }}
      {...props}
    >
      <Text
        px={2}
        noOfLines={1}
        wordBreak="break-all"
        opacity={hasName ? 1 : 0.5}
        children={hasName ? name : "Не определено"}
      />
      {isDone && (
        <Center
          className="score"
          minW="15%"
          w="15%"
          h="full"
          color="text.light.main"
          bg={isWon ? "#7EA973" : "#BBBBBB"}
        >
          <Text
            fontSize="lg"
            noOfLines={1}
            wordBreak="break-all"
            children={resultText || 0}
          />
        </Center>
      )}
    </Flex>
  );
};

type ExtensionsProps = {
  value: string;
};

const SpecificationLabel = ({ value }: ExtensionsProps) => (
  <Text
    pos="absolute"
    top={-1}
    left={3}
    w="calc(100% - 12px)"
    textAlign="center"
    noOfLines={1}
    wordBreak="break-all"
    opacity={value ? 1 : 0.75}
    children={value || "Тема не выбрана"}
  />
);

const Badge = ({ value }: ExtensionsProps) => (
  <Center
    bottom={1.5}
    left={0}
    pos="absolute"
    boxSize={6}
    bg="inherit"
    fontSize="sm"
    lineHeight="0px"
    border="2px solid"
    borderColor="teal.500"
    _dark={{ borderColor: "teal.200" }}
    borderRadius="full"
    children={value}
  />
);

export default Match;
