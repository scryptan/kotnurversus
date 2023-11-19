import {
  Button as BaseButton,
  ButtonProps,
  HStack,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { ReactNode, useId, useRef } from "react";

type Props = {
  name: string;
  value: string;
  Form: (props: SettingsFormProps) => ReactNode;
};

export type SettingsFormProps = {
  formId: string;
  inputId: string;
  defaultValue: string;
  onLoading: (callback: () => Promise<string>) => void;
};

const SettingsLayout = ({ name, value, Form }: Props) => {
  const formId = useId();
  const inputId = useId();

  const valueRef = useRef(value);
  const [isEdit, setIsEdit] = useBoolean(false);
  const [isLoading, setIsLoading] = useBoolean(false);

  const onLoading: SettingsFormProps["onLoading"] = async (callback) => {
    setIsLoading.on();
    try {
      const newValue = await callback();
      valueRef.current = newValue;
    } finally {
      setIsEdit.off();
      setIsLoading.off();
    }
  };

  return (
    <>
      <Text
        m={2}
        as="label"
        htmlFor={inputId}
        color="blackAlpha.500"
        _dark={{ color: "whiteAlpha.500" }}
        fontWeight="semibold"
        children={name}
      />
      {isEdit ? (
        <Form
          formId={formId}
          inputId={inputId}
          defaultValue={valueRef.current}
          onLoading={onLoading}
        />
      ) : (
        <Text
          m={2}
          noOfLines={1}
          wordBreak="break-all"
          children={valueRef.current}
        />
      )}
      <HStack h="40px" justifySelf="flex-end" spacing={4}>
        {isEdit ? (
          <>
            <Button
              type="submit"
              form={formId}
              isLoading={isLoading}
              loadingText="Сохраняю"
              colorScheme="blue"
              children="Сохранить"
            />
            <Button
              isDisabled={isLoading}
              opacity={0.75}
              onClick={setIsEdit.off}
              children="Отмена"
            />
          </>
        ) : (
          <Button
            colorScheme="blue"
            onClick={setIsEdit.on}
            children="Изменить"
          />
        )}
      </HStack>
    </>
  );
};

const Button = (props: ButtonProps) => (
  <BaseButton p={2} variant="link" {...props} />
);

export default SettingsLayout;
