import {
  Box,
  HStack,
  LinkProps,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import BaseLink from "~/components/Link";
import paths from "~/pages/paths";
import ColorModeButton from "../ColorModeButton";

const Header = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      minH="80px"
      bg={`bg.${colorMode}.1`}
      borderBottom="1px solid transparent"
      _light={{ borderColor: "bg.light.2" }}
    >
      <HStack mx="auto" maxW="1248px" h="full" spacing={8}>
        <Logo />
        <ColorModeButton />
        <Spacer />
        <Link href="/">Провести турнир</Link>
        <Link href="/">Турниры</Link>
        <Link border="2px solid" href="/">
          Войти как организатор
        </Link>
      </HStack>
    </Box>
  );
};

const Logo = () => (
  <BaseLink href={paths.main.path} _hover={{ transform: "translateY(5%)" }}>
    <Text as="span" color="secondary" fontSize="32px" fontWeight="semibold">
      Котнур
    </Text>
    <Text ml={0.5} as="span" fontSize="32px" fontWeight="medium">
      Версус
    </Text>
  </BaseLink>
);

const Link = (props: LinkProps) => {
  const { colorMode } = useColorMode();

  return (
    <BaseLink
      {...props}
      px={6}
      py={2}
      fontSize="lg"
      fontWeight="semibold"
      borderRadius="full"
      borderColor={`text.${colorMode}.main`}
      _hover={{ color: "secondary", borderColor: "secondary" }}
    />
  );
};

export default Header;
