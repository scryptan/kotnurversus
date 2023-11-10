import {
  FormControl as ChakraFormControl,
  FormControlProps as ChakraFormControlProps,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export type FormControlProps = {
  label?: string;
  errorMessage?: string;
} & ChakraFormControlProps;

const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ label, errorMessage, children, ...props }, ref) => (
    <ChakraFormControl ref={ref} isInvalid={Boolean(errorMessage)} {...props}>
      {label && (
        <FormLabel mb={1} noOfLines={1} fontSize="sm" children={label} />
      )}
      {children}
      {errorMessage && (
        <FormHelperText
          mt={2}
          color="red.500"
          _dark={{ color: "red.300" }}
          fontSize="xs"
          children={errorMessage}
        />
      )}
    </ChakraFormControl>
  )
);

export default FormControl;
