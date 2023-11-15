import { Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "~/components/Input";
import Textarea from "~/components/Textarea";

type Props = {
  id: string;
  defaultValue?: Partial<ScenarioFormSchema>;
  onSubmit: (data: ScenarioFormSchema) => void;
};

const ScenarioForm = ({ id, defaultValue, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScenarioFormSchema>({
    defaultValues: defaultValue,
    resolver: zodResolver(scenarioFormSchema),
  });

  return (
    <Stack id={id} as="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name")}
        label="Название"
        errorMessage={errors.name?.message}
      />
      <Textarea {...register("description")} minH="160px" label="Описание" />
      <Textarea
        {...register("requirements")}
        minH="200px"
        label="Общие требования"
      />
    </Stack>
  );
};

const scenarioFormSchema = z.object({
  name: z.string().min(1, "Заполните поле"),
  description: z.string().optional(),
  requirements: z.string().optional(),
});

export type ScenarioFormSchema = z.infer<typeof scenarioFormSchema>;

export default ScenarioForm;
