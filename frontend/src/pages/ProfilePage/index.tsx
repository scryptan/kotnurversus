import { Button, Center, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";

const ProfilePage = () => {
  const { isAuthenticated, onLogout } = useAuthContext();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate(paths.main.path, { replace: true });
    return <Center flex={1} children={<Spinner size="lg" />} />;
  }

  const handleLogout = () => {
    navigate(paths.main.path, { replace: true });
    onLogout();
  };

  return (
    <Center mx="auto" w="full" maxW="wrapper" flex={1}>
      <Button
        colorScheme="red"
        onClick={handleLogout}
        children="Выйти из аккаунта"
      />
    </Center>
  );
};

export default ProfilePage;
