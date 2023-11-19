import { Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "~/components/PasswordInput";
import { passwordChangeFormSchema } from "~/utils/auth-schemas";
import { SettingsFormProps } from "./SettingsLayout";

const PasswordSettings = ({
  formId,
  inputId,
  defaultValue,
  onLoading,
}: SettingsFormProps) => {
  const {
    register,
    setFocus,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof passwordChangeFormSchema>>({
    resolver: zodResolver(passwordChangeFormSchema),
  });

  const onSubmit = handleSubmit(() => {
    onLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return defaultValue;
    });
  });

  useEffect(() => {
    setFocus("oldPassword");
  }, []);

  return (
    <Stack as="form" id={formId} spacing={4} onSubmit={onSubmit}>
      <PasswordInput
        {...register("oldPassword")}
        id={inputId}
        label="Старый пароль"
        placeholder="Введите старый пароль"
        errorMessage={errors.oldPassword?.message}
      />
      <PasswordInput
        {...register("password")}
        label="Новый пароль"
        placeholder="Введите новый пароль"
        errorMessage={errors.password?.message}
      />
      <PasswordInput
        {...register("confirmPassword")}
        placeholder="Повторите новый пароль"
        errorMessage={errors.confirmPassword?.message}
      />
    </Stack>
  );
};

export default PasswordSettings;
