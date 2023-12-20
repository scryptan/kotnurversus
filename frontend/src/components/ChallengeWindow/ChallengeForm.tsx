import { Stack, Switch } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Input from "~/components/Input";
import Textarea from "~/components/Textarea";
import SelectCategory from "./SelectCategory";

type Props = {
  id: string;
  defaultValue?: Partial<ChallengeFormSchema>;
  onSubmit: (data: ChallengeFormSchema) => void;
};

const ChallengeForm = ({ id, defaultValue, onSubmit }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChallengeFormSchema>({
    defaultValues: defaultValue,
    resolver: zodResolver(challengeFormSchema),
  });

  return (
    <Stack id={id} as="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="categoryId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <SelectCategory {...field} errorMessage={error?.message} />
        )}
      />
      <Input
        {...register("title")}
        label="Название"
        errorMessage={errors.title?.message}
      />
      <Textarea
        {...register("shortDescription")}
        minH="64px"
        label="Краткое описание"
      />
      <Textarea {...register("description")} minH="160px" label="Описание" />
      <Switch
        {...register("isCatInBag")}
        my={2}
        w="fit-content"
        colorScheme="teal"
        display="flex"
        alignItems="center"
        children="Может быть котом в мешке"
      />
    </Stack>
  );
};

const challengeFormSchema = z.object({
  categoryId: z.string({
    invalid_type_error: "Заполните поле",
    required_error: "Заполните поле",
  }),
  title: z
    .string()
    .min(1, "Заполните поле")
    .max(50, "Максимальная длина 50 символов"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  isCatInBag: z.boolean().default(false),
});

export type ChallengeFormSchema = z.infer<typeof challengeFormSchema>;

export default ChallengeForm;
