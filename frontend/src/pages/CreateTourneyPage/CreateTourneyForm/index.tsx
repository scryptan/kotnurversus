import { Grid, Input, Text, useId } from "@chakra-ui/react";
import { ReactNode } from "react";
import DateInput from "~/components/DateInput";

const CreateTourneyForm = () => (
  <Grid gridTemplateColumns="300px 500px" gridColumnGap={16} gridRowGap={8}>
    <FormLabel isRequired label="Название турнира">
      {(id) => <Input id={id} size="md" />}
    </FormLabel>
    <FormLabel isRequired label="Дата проведения турнира">
      {(id) => <DateInput id={id} size="md" containerProps={{ w: "200px" }} />}
    </FormLabel>
    <FormLabel label="Место проведения">
      {(id) => <Input id={id} size="md" />}
    </FormLabel>
  </Grid>
);

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
