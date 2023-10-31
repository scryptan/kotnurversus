import { Box, HStack, LinkProps, Text } from "@chakra-ui/react";
import BaseLink from "~/components/Link";

const Footer = () => (
  <Box minH="80px">
    <HStack
      mx="auto"
      maxW="wrapper"
      px={12}
      h="full"
      spacing={8}
      justify="space-between"
    >
      <Text color="#808080">© Команда Котнур 2023</Text>
      <Link href="/">Турниры</Link>
      <Link href="/">О проекте</Link>
    </HStack>
  </Box>
);

const Link = (props: LinkProps) => (
  <BaseLink
    color="#808080"
    textDecoration="underline"
    _hover={{
      color: "text.light.main",
      _dark: { color: "text.dark.main" },
    }}
    {...props}
  />
);

export default Footer;
