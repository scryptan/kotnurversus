import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
import inputTheme from "./input";

const baseStyle = defineStyle({
  ...inputTheme.baseStyle?.field,
  paddingY: "2",
  minHeight: "20",
  lineHeight: "short",
  verticalAlign: "top",
});

const variants = {
  primary: defineStyle(
    (props) => inputTheme.variants?.primary(props).field ?? {}
  ),
};

const sizes = {
  xs: inputTheme.sizes?.xs.field ?? {},
  sm: inputTheme.sizes?.sm.field ?? {},
  md: inputTheme.sizes?.md.field ?? {},
  lg: inputTheme.sizes?.lg.field ?? {},
};

export default defineStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: "md",
    variant: "primary",
  },
});
