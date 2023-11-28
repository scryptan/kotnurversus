import {
  Box,
  BoxProps,
  HStack,
  LinkProps,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import ColorModeButton from "~/components/ColorModeButton";
import BaseLink from "~/components/Link";
import paths from "~/pages/paths";
import AuthButton from "./AuthButton";
import { useAuthContext } from "~/utils/auth-context";

const Header = (props: BoxProps) => {
  const { colorMode } = useColorMode();
  const { isAuthenticated } = useAuthContext();

  return (
    <Box
      {...props}
      minH="80px"
      bg={`bg.${colorMode}.1`}
      borderBottom="1px solid transparent"
      borderColor={`bg.${colorMode}.2`}
    >
      <HStack mx="auto" px={6} maxW="wrapper" h="full" spacing={8}>
        <Logo />
        <ColorModeButton />
        <Spacer />
        {isAuthenticated && (
          <Link href={paths.challenges.path}>Доп. требования</Link>
        )}
        <Link href={paths.tourneys.path}>Турниры</Link>
        <AuthButton />
      </HStack>
    </Box>
  );
};

const Logo = () => (
  <BaseLink href={paths.main.path} _hover={{ transform: "scale(1.025)" }}>
    <Text as="span" color="secondary" fontSize="32px" fontWeight="semibold">
      Котнур
    </Text>
    <Text ml={0.5} as="span" fontSize="32px" fontWeight="medium">
      Версус
    </Text>
  </BaseLink>
);

const Link = (props: LinkProps) => (
  <BaseLink
    {...props}
    px={6}
    py={2}
    fontSize="lg"
    fontWeight="semibold"
    borderRadius="full"
    _hover={{ color: "secondary", borderColor: "secondary" }}
  />
);

export default Header;
