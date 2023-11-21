import { HStack, Heading, Stack } from "@chakra-ui/react";
import { FormEvent } from "react";
import Input, { InputProps } from "~/components/Input";
import { useAuthContext } from "~/utils/auth-context";

type Props = {
  tourneyId: string;
};

const TourneyTimersSettings = ({ tourneyId: _ }: Props) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return null;
  }

  const defaultValue = 1200;

  return (
    <Stack spacing={6}>
      <Heading px={3} fontSize="3xl">
        Настройки таймера
      </Heading>
      <HStack spacing="124px">
        <SecondsInput label="Подготовка" defaultValue={defaultValue} />
        <SecondsInput label="Презентация" defaultValue={defaultValue} />
        <SecondsInput label="Защита" defaultValue={defaultValue} />
      </HStack>
    </Stack>
  );
};

const SecondsInput = (props: InputProps) => {
  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
  };

  return (
    <Input
      {...props}
      maxLength={5}
      rightAddon="сек"
      onInput={handleInput}
      containerProps={{ w: "150px" }}
    />
  );
};

export default TourneyTimersSettings;
