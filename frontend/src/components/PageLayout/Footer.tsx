import {
  Box,
  HStack,
  LinkProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import BaseLink from "~/components/Link";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import QrCodeButton from "./QrCodeButton";

const Footer = () => {
  const { isAuthenticated } = useAuthContext();
  const isDesktop = useBreakpointValue(
    { base: false, sm: true },
    { ssr: false }
  );

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
        <Text color="#808080">
          {isAuthenticated ? (
            <RouterLink to={paths.admin.path} tabIndex={-1} children="©" />
          ) : (
            "©"
          )}
          {" Команда Котнур 2023"}
        </Text>
        {isDesktop && <Link href={paths.tourneys.path}>Турниры</Link>}
        {isDesktop && <QrCodeButton />}
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
