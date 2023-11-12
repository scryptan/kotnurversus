import {
  Button as BaseButton,
  ButtonProps,
  Stack,
  forwardRef,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Input from "~/components/Input";
import PasswordInput from "~/components/PasswordInput";
import Window, { WindowProps } from "~/components/Window";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";

const LoginButton = () => {
  const window = useDisclosure();
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return (
      <Button
        as={Link}
        display="flex"
        to={paths.profile.path}
        children="Профиль организатора"
      />
    );
  }

  return (
    <>
      <Button
        {...window.getButtonProps()}
        onClick={window.onOpen}
        children="Войти как организатор"
      />
      <LoginWindow
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
      />
    </>
  );
};

const Button = forwardRef<ButtonProps, "button">((props, ref) => {
  const { colorMode } = useColorMode();

  return (
    <BaseButton
      ref={ref}
      px={6}
      size="md"
      variant="unstyled"
      fontSize="lg"
      fontWeight="semibold"
      borderRadius="full"
      border="2px solid"
      borderColor={`text.${colorMode}.main`}
      _hover={{ color: "secondary", borderColor: "secondary" }}
      {...props}
    />
  );
});

const LoginWindow = (props: WindowProps) => {
  const { onLogin } = useAuthContext();

  const handleSubmit = () => {
    onLogin("mock-token");
    props.onClose();
  };

  return (
    <Window
      heading="Вход"
      contentProps={{ w: "400px" }}
      submitProps={{ onClick: handleSubmit, children: "Вход" }}
      {...props}
    >
      <Stack spacing={4}>
        <Input isRequired label="Логин" />
        <PasswordInput label="Пароль" />
      </Stack>
    </Window>
  );
};

export default LoginButton;
