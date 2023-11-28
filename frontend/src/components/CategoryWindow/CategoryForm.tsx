import { Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ColorInput from "~/components/ColorInput";
import Input from "~/components/Input";

type Props = {
  id: string;
  defaultValue?: Partial<CategoryFormSchema>;
  onSubmit: (data: CategoryFormSchema) => void;
};

const CategoryForm = ({ id, defaultValue, onSubmit }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormSchema>({
    defaultValues: defaultValue,
    resolver: zodResolver(categoryFormSchema),
  });

  return (
    <Stack id={id} as="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("title")}
        label="Название"
        placeholder="Введите название категории"
        errorMessage={errors.title?.message}
      />
      <Controller
        name="color"
        control={control}
        render={({ field, fieldState }) => (
          <ColorInput
            {...field}
            label="Цвет"
            placeholder="Выберите цвет категории"
            errorMessage={fieldState.error?.message}
          />
        )}
      />
    </Stack>
  );
};

const categoryFormSchema = z.object({
  title: z
    .string()
    .min(1, "Заполните поле")
    .max(50, "Максимальная длина 50 символов"),
  color: z.string({ required_error: "Выберите цвет" }).min(1, "Выберите цвет"),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export default CategoryForm;
