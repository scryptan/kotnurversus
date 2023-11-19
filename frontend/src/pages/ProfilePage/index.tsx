import { Center, Spinner, Stack } from "@chakra-ui/react";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import SettingsSection from "./SettingsSection";
import TourneysSection from "./TourneysSection";

const ProfilePage = () => {
  const { isAuthenticated } = useAuthContext();

  useAutoRedirect({ isEnabled: !isAuthenticated, path: paths.main.path });

  if (!isAuthenticated) {
    return <Center flex={1} children={<Spinner size="lg" />} />;
  }

  return (
    <Stack mx="auto" px={8} w="full" maxW="wrapper" flex={1} spacing={20}>
      <SettingsSection />
      <TourneysSection />
    </Stack>
  );
};

export default ProfilePage;
