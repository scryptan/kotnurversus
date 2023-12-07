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

  const isLoaded = "isLoading" in match ? !match.isLoading : true;

  const isInit = match.state === TourneyRoundState.Init;
  const isDone = match.state === TourneyRoundState.Complete;
  const borderColor =
    colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300";
  const hoverBorderColor =
    colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.500";

  const linkProps = !isInit
    ? {
        as: Link,
        to: paths.round.path(match.id),
        cursor: "pointer",
        transition: "border 200ms ease-out",
        _hover: { borderColor: hoverBorderColor },
      }
    : {};

  return (
    <Box pl={3} h="full">
      <Box h={6}>
        {isLoaded && "specification" in match && (
          <SpecificationLabel value={match.specification?.title} />
        )}
      </Box>
      <Skeleton
        h="calc(100% - 48px)"
        borderRadius={4}
        isLoaded={isLoaded}
        startColor={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"}
        endColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
      >
        <Flex
          h="full"
          border="1px solid"
          borderColor={borderColor}
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
          <Box border="1px solid" borderColor={borderColor} />
          <Side
            isDone={isDone}
            isWon={bottomWon}
            name={bottomParty.name}
            resultText={bottomParty.resultText}
          />
        </Flex>
      </Skeleton>
      <Box h={6}>
        {isLoaded && "badgeValue" in match && (
          <Badge value={match.badgeValue} />
        )}
      </Box>
    </Box>
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
  const isDisabled = !hasName || (isDone && !isWon);

  return (
    <Flex
      h="full"
      align="center"
      justify="space-between"
      bg="blackAlpha.100"
      _dark={{ bg: "whiteAlpha.100" }}
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
        color={isDisabled ? "blackAlpha.500" : "text.light.main"}
        _dark={{ color: isDisabled ? "whiteAlpha.500" : "text.dark.main" }}
        fontSize={{ base: "sm", md: "md" }}
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
            fontSize={{ base: "md", md: "lg" }}
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
    textAlign="center"
    noOfLines={1}
    wordBreak="break-all"
    fontSize={{ base: "sm", md: "md" }}
    color={value ? "text.light.main" : "blackAlpha.500"}
    _dark={{ color: value ? "text.dark.main" : "whiteAlpha.500" }}
    children={value || "Тема не выбрана"}
  />
);

const Badge = ({ value }: ExtensionsProps) => (
  <Center
    ml={-3}
    mt={-3}
    boxSize={6}
    bg="teal.100"
    fontSize="sm"
    lineHeight="0px"
    border="2px solid"
    borderColor="teal.300"
    _dark={{ bg: "teal.800", borderColor: "teal.200" }}
    borderRadius="full"
    children={value}
  />
);

export default Match;
