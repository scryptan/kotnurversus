import {
  Textarea as ChakraTextArea,
  TextareaProps as ChakraTextareaProps,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import FormControl, { FormControlProps } from "./FormControl";

export type TextareaProps = {
  label?: string;
  errorMessage?: string;
  containerProps?: FormControlProps;
} & ChakraTextareaProps;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, errorMessage, containerProps, ...props }, ref) => (
    <FormControl label={label} errorMessage={errorMessage} {...containerProps}>
      <ChakraTextArea ref={ref} resize="none" required={false} {...props} />
    </FormControl>
  )
);

export default Textarea;
