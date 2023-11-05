import {
  Box,
  BoxProps,
  Flex,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { memo } from "react";
import { Team } from "~/types/team";

type Props = {
  team: Team;
} & BoxProps;

const TeamCard = ({ team, ...props }: Props) => (
  <Box
    w="250px"
    bg="blackAlpha.100"
    boxShadow="base"
    borderRadius={4}
    border="1px solid"
    borderColor="blackAlpha.400"
    _dark={{
      bg: "whiteAlpha.100",
      borderColor: "whiteAlpha.400",
    }}
    {...props}
  >
    <Flex px={4} h="42px" align="center">
      <Text
        fontSize="2xl"
        noOfLines={1}
        wordBreak="break-all"
        children={team.name}
      />
    </Flex>
    <OrderedList
      m={0}
      px={4}
      py={2}
      spacing={1}
      borderTop="1px solid"
      borderColor="inherit"
    >
      {team.participants.map((p, i) => (
        <ListItem ml={4} key={i}>
          <Text noOfLines={1} wordBreak="break-all" children={p} />
        </ListItem>
      ))}
    </OrderedList>
  </Box>
);

export default memo(TeamCard, (prev, next) => {
  return prev.team.id === next.team.id;
});
