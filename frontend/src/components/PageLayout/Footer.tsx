import { Box, HStack, LinkProps, Text, useMediaQuery } from "@chakra-ui/react";
import BaseLink from "~/components/Link";
import paths from "~/pages/paths";

const Footer = () => {
  const [isDesktop] = useMediaQuery("(min-width: 48em)");

  return (
    <Box minH={{ base: "55px", md: "80px" }}>
      <HStack
        mx="auto"
        maxW="wrapper"
        px={{ base: 6, md: 12 }}
        h="full"
        spacing={8}
        justify={{ base: "center", md: "space-between" }}
      >
        <Text color="#808080">© Команда Котнур 2023</Text>
        {isDesktop && <Link href={paths.tourneys.path}>Турниры</Link>}
        {isDesktop && <Link href="/">О проекте</Link>}
      </HStack>
    </Box>
  );
};

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
