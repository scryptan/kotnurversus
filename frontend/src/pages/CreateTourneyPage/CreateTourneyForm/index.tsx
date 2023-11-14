import { Button, Grid, Radio, RadioGroup, Text, useId } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import DateInput from "~/components/DateInput";
import Input from "~/components/Input";
import TimeInput from "~/components/TimeInput";
import { TourneyType } from "~/types/tourney";
import { TOURNEY_TYPE_NAMES } from "~/utils/tourney";
import { TourneyFormSchema, tourneyFormSchema } from "./tourney-form-schema";

const CreateTourneyForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourneyFormSchema>({
    resolver: zodResolver(tourneyFormSchema),
  });

  const onSubmit = handleSubmit(console.log);

  return (
    <Grid
      as="form"
      gridTemplateColumns="300px 500px"
      gridColumnGap={16}
      gridRowGap={8}
      onSubmit={onSubmit}
    >
      <FormLabel isRequired label="Название турнира">
        {(id) => (
          <Input
            id={id}
            size="md"
            errorMessage={errors.name?.message}
            {...register("name")}
          />
        )}
      </FormLabel>
      <FormLabel isRequired label="Дата проведения турнира">
        {(id) => (
          <Controller
            name="day"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DateInput
                {...field}
                id={id}
                size="md"
                containerProps={{ w: "200px" }}
                errorMessage={error?.message}
              />
            )}
          />
        )}
      </FormLabel>
      <FormLabel isRequired label="Время турнира">
        {(id) => (
          <Controller
            name="time"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TimeInput
                {...field}
                id={id}
                size="md"
                containerProps={{ w: "110px" }}
                errorMessage={error?.message}
              />
            )}
          />
        )}
      </FormLabel>
      <FormLabel label="Место проведения">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RadioGroup
              colorScheme="teal"
              display="flex"
              gap={4}
              {...field}
              defaultValue={TourneyType.Offline}
            >
              {Object.entries(TOURNEY_TYPE_NAMES).map(([value, name]) => (
                <Radio key={value} value={value} children={name} />
              ))}
            </RadioGroup>
          )}
        />
      </FormLabel>
      <FormLabel label="Место проведения">
        {(id) => <Input {...register("location")} id={id} size="md" />}
      </FormLabel>
      <FormLabel label="Темы бизнес-сценариев">
        {(id) => <Input id={id} size="md" />}
      </FormLabel>
      <FormLabel label="Дополнительные требования">
        {(id) => <Input id={id} size="md" />}
      </FormLabel>
      <Button
        mt={8}
        w="50%"
        gridColumn="2 / -1"
        colorScheme="teal"
        type="submit"
        children="Создать турнир"
      />
    </Grid>
  );
};

type FormLabelProps = {
  label: string;
  isRequired?: boolean;
  children: ReactNode | ((id: string) => ReactNode);
};

const FormLabel = ({ label, isRequired, children }: FormLabelProps) => {
  const id = useId();

  return (
    <>
      <Text as="label" htmlFor={id} mt={2} fontSize="lg" justifySelf="flex-end">
        {label}
        {isRequired && <Text as="span" ml={2} color="red.500" children="*" />}
      </Text>
      {typeof children === "function" ? children(id) : children}
    </>
  );
};

export default CreateTourneyForm;
