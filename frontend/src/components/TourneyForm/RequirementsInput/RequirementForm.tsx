import { Button, ButtonProps, Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Input from "~/components/Input";
import Select from "~/components/Select";
import Textarea from "~/components/Textarea";

type Props = {
  id: string;
  defaultValue?: Partial<RequirementFormSchema>;
  onSubmit: (data: RequirementFormSchema) => void;
};

const RequirementForm = ({ id, defaultValue, onSubmit }: Props) => {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RequirementFormSchema>({
    defaultValues: defaultValue,
    resolver: zodResolver(requirementFormSchema),
  });

  const handleCreateCategory = (value: string) => () => {
    mockCategory.push({ label: value, value });
    setValue("category", value, { shouldValidate: true });
  };

  return (
    <Stack id={id} as="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="category"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Select.Single
            {...field}
            key={mockCategory.length}
            isHideClear
            label="Категория"
            options={mockCategory}
            errorMessage={error?.message}
            NotFoundComponent={({ text }) => (
              <CreateCategoryButton onClick={handleCreateCategory(text)} />
            )}
          />
        )}
      />
      <Input
        {...register("name")}
        label="Название требования"
        errorMessage={errors.name?.message}
      />
      <Textarea
        {...register("description")}
        minH="160px"
        label="Описание требования"
      />
    </Stack>
  );
};

const mockCategory = [
  { label: "Технологии прошлого", value: "Технологии прошлого" },
];

const requirementFormSchema = z.object({
  category: z.string({
    invalid_type_error: "Заполните поле",
    required_error: "Заполните поле",
  }),
  name: z.string().min(1, "Заполните поле"),
  description: z.string().optional(),
});

export type RequirementFormSchema = z.infer<typeof requirementFormSchema>;

const CreateCategoryButton = (props: ButtonProps) => (
  <Button
    mx={1}
    mt={2}
    tabIndex={-1}
    variant="link"
    colorScheme="blue"
    fontWeight="semibold"
    children="Создать категорию из строки"
    {...props}
  />
);

export default RequirementForm;
