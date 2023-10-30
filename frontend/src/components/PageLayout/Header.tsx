import { Box, HStack, LinkProps, Spacer, Text } from "@chakra-ui/react";
import paths from "~/pages/paths";
import Link from "~/components/Link";

const Header = () => (
  <Box h="80px" borderBottom="1px solid" borderColor="bg.2">
    <HStack mx="auto" maxW="1248px" h="full" spacing={8}>
      <Logo />
      <Spacer />
      <NavLink href="/">Провести турнир</NavLink>
      <NavLink href="/">Турниры</NavLink>
      <NavLink border="2px solid" href="/">
        Войти как организатор
      </NavLink>
    </HStack>
  </Box>
);

const Logo = () => (
  <Link href={paths.main.path} _hover={{ transform: "translateY(5%)" }}>
    <Text as="span" color="secondary" fontSize="32px" fontWeight="semibold">
      Котнур
    </Text>
    <Text
      ml={0.5}
      as="span"
      color="text.main"
      fontSize="32px"
      fontWeight="medium"
    >
      Версус
    </Text>
  </Link>
);

const NavLink = (props: LinkProps) => (
  <Link
    px={6}
    py={2}
    fontSize="lg"
    fontWeight="semibold"
    borderRadius="full"
    borderColor="text.main"
    _hover={{ color: "secondary", borderColor: "secondary" }}
    {...props}
  />
);

export default Header;
