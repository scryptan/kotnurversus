import { BoxProps, Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  isMinContent?: boolean;
  children: ReactNode;
} & BoxProps;

const StageMainInfo = ({ isMinContent, children, ...props }: Props) => (
  <Center gridArea="m" {...props}>
    <Text
      w={isMinContent ? "min-content" : "fit-content"}
      textAlign="center"
      fontSize={{ base: "lg", md: "2xl" }}
      lineHeight="150%"
      textTransform="uppercase"
      children={children}
    />
  </Center>
);

export default StageMainInfo;
