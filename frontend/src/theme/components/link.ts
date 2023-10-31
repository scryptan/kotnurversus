import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";

const baseStyle = defineStyle({
  transitionProperty: "common",
  transitionDuration: "normal",
  transitionTimingFunction: "ease-out",
  cursor: "pointer",
  textDecoration: "none",
  outline: "none",
  color: "inherit",
  borderRadius: 2,
  _hover: {
    textDecoration: "none",
  },
  _focusVisible: {
    textDecoration: "none",
  },
});

const variantUnderline = defineStyle({
  _hover: {
    textDecoration: "underline",
  },
  _focusVisible: {
    textDecoration: "underline",
    boxShadow: "none",
  },
});

const variants = {
  underline: variantUnderline,
};

export default defineStyleConfig({
  baseStyle,
  variants,
});
