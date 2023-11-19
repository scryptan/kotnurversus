import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "~/components/Input";
import { SettingsFormProps } from "./SettingsLayout";
import { useEffect } from "react";

const nameSchema = z.object({
  value: z
    .string({ required_error: "Заполните поле" })
    .min(1, "Заполните поле"),
});

const NameSettings = ({
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
  } = useForm<z.infer<typeof nameSchema>>({
    defaultValues: { value: defaultValue },
    resolver: zodResolver(nameSchema),
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
        placeholder="Введите новое имя"
        errorMessage={errors.value?.message}
      />
    </form>
  );
};

export default NameSettings;
