import {
  Box,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Text,
  Tooltip,
  useId,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import DateInput from "~/components/DateInput";
import Input from "~/components/Input";
import TimeInput from "~/components/TimeInput";
import { TourneyType } from "~/types/tourney";
import { TOURNEY_TYPE_NAMES } from "~/utils/tourney";
import { TourneyFormSchema, tourneyFormSchema } from "./schema";

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
            placeholder="Введите название турнира"
            errorMessage={errors.title?.message}
            {...register("title")}
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
      <FormLabel isRequired label="Время начала турнира">
        {(id) => (
          <Controller
            name="time"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TimeInput
                {...field}
                id={id}
                containerProps={{ w: "140px" }}
                errorMessage={error?.message}
              />
            )}
          />
        )}
      </FormLabel>
      <FormLabel isRequired label="Формат проведения">
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
        {(id) => (
          <Input
            {...register("description")}
            id={id}
            placeholder="Введите место проведения"
          />
        )}
      </FormLabel>
      <FormLabel label="Без повторов в финале">
        {(id) => (
          <Tooltip
            hasArrow
            placement="right"
            label="Доп. требования, которые уже были использованы на предыдущих этапах, не будут повторяться в финале"
          >
            <Box my={1} as="span" w="fit-content">
              <Switch
                {...register("enableRepeatChallengesInFinal")}
                id={id}
                size="lg"
                colorScheme="cyan"
              />
            </Box>
          </Tooltip>
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

  const needId = typeof children === "function";

  return (
    <>
      <Text
        mt={2}
        h="fit-content"
        fontSize="lg"
        fontWeight="medium"
        justifySelf="flex-end"
        {...(needId ? { as: "label", htmlFor: id } : {})}
      >
        {label}
        {isRequired && <Text as="span" ml={2} color="red.500" children="*" />}
      </Text>
      {needId ? children(id) : children}
    </>
  );
};

export default TourneyForm;
