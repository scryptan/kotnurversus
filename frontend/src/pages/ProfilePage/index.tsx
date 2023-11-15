import { Button, Center, Spinner } from "@chakra-ui/react";
import useAutoRedirect from "~/hooks/useAutoRedirect";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";

const ProfilePage = () => {
  const { isAuthenticated, onLogout } = useAuthContext();

  useAutoRedirect({ isEnabled: !isAuthenticated, path: paths.main.path });

  if (!isAuthenticated) {
    return <Center flex={1} children={<Spinner size="lg" />} />;
  }

  return (
    <Center mx="auto" w="full" maxW="wrapper" flex={1}>
      <Button
        colorScheme="red"
        onClick={onLogout}
        children="Выйти из аккаунта"
      />
    </Center>
  );
};

export default ProfilePage;
