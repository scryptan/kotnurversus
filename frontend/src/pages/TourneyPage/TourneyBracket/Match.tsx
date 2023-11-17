import {
  Box,
  Center,
  Flex,
  FlexProps,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MatchComponentProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { Link } from "react-router-dom";
import paths from "~/pages/paths";
import { MatchState } from "~/types/match";

const Match = ({
  match,
  topWon,
  topParty,
  bottomParty,
  bottomWon,
}: MatchComponentProps) => {
  const { colorMode } = useColorMode();

  const isDone = match.state === MatchState.Done;
  const borderColor =
    colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300";

  return (
    <Flex
      as={Link}
      to={paths.match.path(match.id)}
      border="1px solid"
      borderColor={borderColor}
      h="full"
      bg={`bg.${colorMode}.2`}
      cursor="pointer"
      flexDir="column"
      justify="space-between"
      borderRadius={4}
      transition="opacity 200ms ease-out"
      _hover={{ opacity: 0.75 }}
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
    </Flex>
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

export default Match;
