import {
  BoxProps,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputElementProps,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { ReactNode, forwardRef } from "react";
import FormControl from "./FormControl";

export type InputProps = {
  label?: string;
  errorMessage?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  rightAddon?: ReactNode;
  leftElementProps?: InputElementProps;
  rightElementProps?: InputElementProps;
  containerProps?: Omit<BoxProps, "children">;
} & ChakraInputProps;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      label,
      errorMessage,
      isRequired,
      leftElement,
      rightElement,
      rightAddon,
      leftElementProps,
      rightElementProps,
      containerProps,
      ...props
    },
    ref
  ) => (
    <FormControl
      label={label}
      errorMessage={errorMessage}
      isRequired={isRequired}
      {...containerProps}
    >
      <InputGroup size={size}>
        {leftElement && (
          <InputLeftElement {...leftElementProps} children={leftElement} />
        )}
        <ChakraInput ref={ref} autoComplete="off" required={false} {...props} />
        {rightElement && (
          <InputRightElement {...rightElementProps} children={rightElement} />
        )}
        {rightAddon && <InputRightAddon children={rightAddon} />}
      </InputGroup>
    </FormControl>
  )
);

export default Input;
