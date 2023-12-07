import {
  Button,
  ButtonProps,
  Stack,
  forwardRef,
  useBoolean,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import Input from "~/components/Input";
import PasswordInput from "~/components/PasswordInput";
import Window, { WindowProps } from "~/components/Window";
import useBreakpoint from "~/hooks/useBreakpoint";
import paths from "~/pages/paths";
import { useAuthContext } from "~/utils/auth-context";
import { loginFormSchema, registerFormSchema } from "~/utils/auth-schemas";

const AuthButton = () => {
  const window = useDisclosure();
  const { isAuthenticated } = useAuthContext();
  const breakpoint = useBreakpoint(["base", "md", "xl"]);

  if (breakpoint === "base") {
    return null;
  }

  if (isAuthenticated) {
    return (
      <ActionButton
        as={Link}
        display="flex"
        to={paths.profile.path}
        children={breakpoint === "xl" ? "Профиль организатора" : "Профиль"}
      />
    );
  }

  return (
    <>
      <ActionButton
        {...window.getButtonProps()}
        onClick={window.onOpen}
        children="Войти как организатор"
      />
      <AuthWindow
        {...window.getDisclosureProps()}
        isOpen={window.isOpen}
        onClose={window.onClose}
      />
    </>
  );
};

const ActionButton = forwardRef<ButtonProps, "button">((props, ref) => {
  const { colorMode } = useColorMode();

  return (
    <Button
      ref={ref}
      px={6}
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

const AuthWindow = (props: WindowProps) => {
  const { onLogin } = useAuthContext();
  const [isRegistration, setIsRegistration] = useBoolean(false);
  const formId = useId();

  const handleSubmit = (login: string, password: string) => {
    onLogin(`${login} ${password}`);
    props.onClose();
  };

  const Form = isRegistration ? RegisterForm : LoginForm;

  return (
    <Window
      isHideCancel
      heading={isRegistration ? "Регистрация" : "Вход в аккаунт"}
      contentProps={{ w: "450px" }}
      submitProps={{
        type: "submit",
        form: formId,
        children: isRegistration ? "Зарегистрироваться" : "Войти",
      }}
      extraButton={
        <Button
          variant="link"
          colorScheme="blue"
          onClick={setIsRegistration.toggle}
          children={isRegistration ? "Вход" : "Регистрация"}
        />
      }
      children={<Form id={formId} onSubmit={handleSubmit} />}
      {...props}
    />
  );
};

type AuthFormProps = {
  id: string;
  onSubmit: (login: string, password: string) => void;
};

const LoginForm = ({ id, onSubmit }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <Stack
      as="form"
      id={id}
      spacing={4}
      onSubmit={handleSubmit((data) => onSubmit(data.login, data.password))}
    >
      <Input
        {...register("login")}
        size="lg"
        label="Имя пользователя или адрес эл.почты"
        placeholder="Логин"
        errorMessage={errors.login?.message}
      />
      <PasswordInput
        {...register("password")}
        size="lg"
        label="Пароль"
        placeholder="Пароль"
        errorMessage={errors.password?.message}
      />
    </Stack>
  );
};

const RegisterForm = ({ id, onSubmit }: AuthFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  return (
    <Stack
      as="form"
      id={id}
      spacing={4}
      onSubmit={handleSubmit((data) => onSubmit(data.login, data.password))}
    >
      <Input
        {...register("login")}
        size="lg"
        label="Имя пользователя или адрес эл.почты"
        placeholder="Логин"
        errorMessage={errors.login?.message}
      />
      <PasswordInput
        {...register("password")}
        size="lg"
        label="Пароль"
        placeholder="Пароль"
        errorMessage={errors.password?.message}
      />
      <PasswordInput
        {...register("confirmPassword")}
        size="lg"
        label="Повторите пароль"
        placeholder="Пароль"
        errorMessage={errors.confirmPassword?.message}
      />
    </Stack>
  );
};

export default AuthButton;
