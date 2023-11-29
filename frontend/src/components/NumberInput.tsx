import {
  BoxProps,
  NumberInput as ChakraNumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
  forwardRef,
} from "@chakra-ui/react";
import FormControl from "./FormControl";

type Props = {
  label?: string;
  errorMessage?: string;
  onChange?: (value: number) => void;
  containerProps?: BoxProps;
} & Omit<NumberInputProps, "onChange">;

const NumberInput = forwardRef<Props, "input">(
  (
    { label, errorMessage, onChange, min = 0, max, containerProps, ...props },
    ref
  ) => (
    <FormControl label={label} errorMessage={errorMessage} {...containerProps}>
      <ChakraNumberInput
        ref={ref}
        min={min}
        max={max}
        allowMouseWheel
        format={(value) => value || min}
        onChange={(_, value) => {
          const normalizedValue = Math.max(min, isNaN(value) ? min : value);
          return onChange?.(
            max === undefined ? normalizedValue : Math.min(max, normalizedValue)
          );
        }}
        {...props}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </ChakraNumberInput>
    </FormControl>
  )
);

export default NumberInput;
