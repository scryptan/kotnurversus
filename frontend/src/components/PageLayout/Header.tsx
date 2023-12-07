import {
  Box,
  BoxProps,
  HStack,
  LinkProps,
  Spacer,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import ColorModeButton from "~/components/ColorModeButton";
import BaseLink from "~/components/Link";
import useBreakpoint from "~/hooks/useBreakpoint";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import AuthButton from "./AuthButton";

const Header = (props: BoxProps) => (
  <Box
    {...props}
    minH={{ base: "55px", md: "80px" }}
    bg="bg.light.1"
    borderBottom="1px solid transparent"
    borderColor="bg.light.2"
    _dark={{ bg: "bg.dark.1", borderColor: "bg.dark.2" }}
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
      <ChallengesLink />
      <Link href={paths.tourneys.path}>Турниры</Link>
      <AuthButton />
    </HStack>
  </Box>
);

const Logo = () => {
  const { isAuthenticated } = useAuthContext();
  const logoLabel = useBreakpointValue({
    base: "К",
    md: isAuthenticated ? "К" : "Котнур",
    lg: "Котнур",
  });

  return (
    <BaseLink href={paths.main.path} _hover={{ transform: "scale(1.025)" }}>
      <Text
        as="span"
        color="secondary"
        fontSize={{ base: "xl", md: "32px" }}
        fontWeight="semibold"
        children={logoLabel}
      />
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

const ChallengesLink = () => {
  const { isAuthenticated } = useAuthContext();
  const breakpoint = useBreakpoint(["base", "md", "lg"]);

  if (!isAuthenticated || breakpoint === "base") {
    return null;
  }

  return (
    <Link
      href={paths.challenges.path}
      children={breakpoint === "lg" ? "Доп. требования" : "Требования"}
    />
  );
};

const Link = (props: LinkProps) => (
  <BaseLink
    {...props}
    px={{ base: 2, md: 4, xl: 6 }}
    py={2}
    fontSize={{ base: "md", md: "lg" }}
    fontWeight="semibold"
    borderRadius="full"
    _hover={{ color: "secondary", borderColor: "secondary" }}
  />
);

export default Header;
