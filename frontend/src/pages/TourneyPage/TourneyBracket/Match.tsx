import { Center, Flex, FlexProps, Text } from "@chakra-ui/react";
import { MatchComponentProps } from "@g-loot/react-tournament-brackets/dist/src/types";
import { Link } from "react-router-dom";

const Match = ({
  match,
  topWon,
  topParty,
  bottomParty,
  bottomWon,
}: MatchComponentProps) => (
  <Flex
    as={Link}
    to={`/?matchId=${match.id}`}
    h="full"
    cursor="pointer"
    flexDir="column"
    justify="space-between"
    borderRadius={4}
    transition="opacity 200ms ease-out"
    _hover={{ opacity: 0.75 }}
  >
    <Side
      isWon={topWon}
      name={topParty.name}
      resultText={topParty.resultText}
    />
    <Side
      isWon={bottomWon}
      name={bottomParty.name}
      resultText={bottomParty.resultText}
    />
  </Flex>
);

type SideProps = {
  isWon?: boolean;
  name?: string;
  resultText?: string | null;
} & FlexProps;

const Side = ({ isWon, name, resultText, ...props }: SideProps) => (
  <Flex
    h="full"
    bg={isWon ? "#3D3D3D" : "#858585"}
    align="center"
    justify="space-between"
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
      color="text.dark.main"
      noOfLines={1}
      wordBreak="break-all"
      children={name}
    />
    <Center
      className="score"
      minW="20%"
      w="20%"
      h="full"
      fontSize="lg"
      color="text.light.main"
      bg={isWon ? "#7EA973" : "#BBBBBB"}
    >
      <Text noOfLines={1} wordBreak="break-all" children={resultText} />
    </Center>
  </Flex>
);

export default Match;
