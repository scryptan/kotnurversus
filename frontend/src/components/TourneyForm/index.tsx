import { Grid, Radio, RadioGroup, Text, useId } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import DateInput from "~/components/DateInput";
import Input from "~/components/Input";
import TimeInput from "~/components/TimeInput";
import { TourneyType } from "~/types/tourney";
import { TOURNEY_TYPE_NAMES } from "~/utils/tourney";
import RequirementsInput from "./RequirementsInput";
import ScenariosInput from "./ScenariosInput";
import { TourneyFormSchema, tourneyFormSchema } from "./tourney-form-schema";

type Props = {
  id?: string;
  defaultValue?: Partial<TourneyFormSchema>;
  onSubmit: (data: TourneyFormSchema) => void;
};

const TourneyForm = ({ id, defaultValue, onSubmit }: Props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourneyFormSchema>({
    defaultValues: defaultValue,
    resolver: zodResolver(tourneyFormSchema),
  });

  return (
    <Grid
      id={id}
      as="form"
      gridRowGap={8}
      gridColumnGap={16}
      gridTemplateColumns="300px 500px"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormLabel isRequired label="Название турнира">
        {(id) => (
          <Input
            id={id}
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
              {...field}
              gap={4}
              display="flex"
              colorScheme="teal"
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
        {(id) => <Input {...register("location")} id={id} />}
      </FormLabel>
      <FormLabel label="Темы бизнес-сценариев">
        {(id) => (
          <Controller
            name="scenarioIds"
            control={control}
            render={({ field }) => (
              <ScenariosInput
                {...field}
                id={id}
                placeholder="Введите тему бизнес-сценария"
              />
            )}
          />
        )}
      </FormLabel>
      <FormLabel label="Дополнительные требования">
        {(id) => (
          <Controller
            name="requirementIds"
            control={control}
            render={({ field }) => (
              <RequirementsInput
                {...field}
                id={id}
                placeholder="Введите название дополнительного требования"
              />
            )}
          />
        )}
      </FormLabel>
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
      <Text
        as="label"
        htmlFor={id}
        mt={2}
        h="fit-content"
        fontSize="lg"
        justifySelf="flex-end"
      >
        {label}
        {isRequired && <Text as="span" ml={2} color="red.500" children="*" />}
      </Text>
      {typeof children === "function" ? children(id) : children}
    </>
  );
};

export default TourneyForm;