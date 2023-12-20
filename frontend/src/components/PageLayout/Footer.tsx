import { Box, HStack, Text, useBreakpointValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import QrCodeButton from "./QrCodeButton";

const Footer = () => {
  const { isAuthenticated } = useAuthContext();
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
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
        {isDesktop && <QrCodeButton />}
      </HStack>
    </Box>
  );
};

export default Footer;
