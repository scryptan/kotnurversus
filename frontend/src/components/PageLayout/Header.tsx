import {
  Box,
  BoxProps,
  HStack,
  LinkProps,
  Spacer,
  Text,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import ColorModeButton from "~/components/ColorModeButton";
import BaseLink from "~/components/Link";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import AuthButton from "./AuthButton";

const Header = (props: BoxProps) => {
  const [isDesktop] = useMediaQuery("(min-width: 48em)");
  const { colorMode } = useColorMode();
  const { isAuthenticated } = useAuthContext();

  return (
    <Box
      {...props}
      minH={{ base: "55px", md: "80px" }}
      bg={`bg.${colorMode}.1`}
      borderBottom="1px solid transparent"
      borderColor={`bg.${colorMode}.2`}
    >
      <HStack
        mx="auto"
        px={{ base: 4, md: 6 }}
        maxW="wrapper"
        h="full"
        spacing={{ base: 4, lg: 8 }}
      >
        <Logo />
        <ColorModeButton />
        <Spacer />
        {isAuthenticated && isDesktop && (
          <Link href={paths.challenges.path}>Доп. требования</Link>
        )}
        <Link href={paths.tourneys.path}>Турниры</Link>
        {isDesktop && <AuthButton />}
      </HStack>
    </Box>
  );
};

const Logo = () => {
  const [isDesktop] = useMediaQuery("(min-width: 48em)");

  return (
    <BaseLink href={paths.main.path} _hover={{ transform: "scale(1.025)" }}>
      <Text
        as="span"
        color="secondary"
        fontSize={{ base: "xl", md: "32px" }}
        fontWeight="semibold"
      >
        {isDesktop ? "Котнур" : "К"}
      </Text>
      <Text
        ml={0.5}
        as="span"
        fontSize={{ base: "xl", md: "32px" }}
        fontWeight="medium"
      >
        Версус
      </Text>
    </BaseLink>
  );
};

const Link = (props: LinkProps) => (
  <BaseLink
    {...props}
    px={{ base: 2, md: 6 }}
    py={2}
    fontSize={{ base: "md", md: "lg" }}
    fontWeight="semibold"
    borderRadius="full"
    _hover={{ color: "secondary", borderColor: "secondary" }}
  />
);

export default Header;
