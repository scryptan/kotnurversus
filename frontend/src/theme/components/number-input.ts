import { numberInputAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import inputTheme from "./input";

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

export default defineMultiStyleConfig({
  variants: inputTheme.variants,
  defaultProps: inputTheme.defaultProps,
});
