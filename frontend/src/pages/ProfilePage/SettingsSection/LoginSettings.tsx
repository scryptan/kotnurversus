import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "~/components/Input";
import { loginField } from "~/utils/auth-schemas";
import { SettingsFormProps } from "./SettingsLayout";

const loginSchema = z.object({ value: loginField });

const LoginSettings = ({
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
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: { value: defaultValue },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit((data) => {
    onLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return data.value;
    });
  });

  useEffect(() => {
    setFocus("value");
  }, []);

  return (
    <form id={formId} onSubmit={onSubmit}>
      <Input
        {...register("value")}
        id={inputId}
        placeholder="Введите новый логин"
        errorMessage={errors.value?.message}
      />
    </form>
  );
};

export default LoginSettings;
