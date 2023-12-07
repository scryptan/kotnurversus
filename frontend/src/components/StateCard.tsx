import { Box, BoxProps } from "@chakra-ui/react";

type Props = {
  name: string;
} & BoxProps;

const StateCard = ({ name, ...props }: Props) => (
  <Box
    px={4}
    py={2}
    w="fit-content"
    fontSize={{ base: "sm", md: "lg" }}
    fontWeight="bold"
    lineHeight="100%"
    textTransform="uppercase"
    borderRadius={8}
    border="1px solid #61b4eb"
    boxShadow="0px 0px 5px 0px #61b4eb"
    _dark={{
      border: "1px solid #35607D",
      boxShadow: "0px 0px 5px 0px #35607D",
    }}
    children={name}
    {...props}
  />
);

export default StateCard;
