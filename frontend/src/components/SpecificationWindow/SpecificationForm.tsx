import { Stack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Input from "~/components/Input";
import Textarea from "~/components/Textarea";

type Props = {
  id: string;
  defaultValue?: Partial<SpecificationFormSchema>;
  onSubmit: (data: SpecificationFormSchema) => void;
};

const SpecificationForm = ({ id, defaultValue, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpecificationFormSchema>({
    defaultValues: defaultValue,
    resolver: zodResolver(specificationFormSchema),
  });

  return (
    <Stack id={id} as="form" spacing={3} onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("title")}
        label="Название"
        errorMessage={errors.title?.message}
      />
      <Textarea
        {...register("businessDescription")}
        minH="160px"
        label="Описание"
      />
      <Textarea
        {...register("techDescription")}
        minH="200px"
        label="Общие требования"
      />
    </Stack>
  );
};

const specificationFormSchema = z.object({
  title: z.string().min(1, "Заполните поле"),
  businessDescription: z.string().optional(),
  techDescription: z.string().optional(),
});

export type SpecificationFormSchema = z.infer<typeof specificationFormSchema>;

export default SpecificationForm;
