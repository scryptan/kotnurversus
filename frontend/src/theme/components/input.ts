import { inputAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const $height = cssVar("input-height");
const $fontSize = cssVar("input-font-size");
const $padding = cssVar("input-padding");
const $borderRadius = cssVar("input-border-radius");

const baseStyle = definePartsStyle({
  addon: {
    height: $height.reference,
    fontSize: $fontSize.reference,
    px: $padding.reference,
    borderRadius: $borderRadius.reference,
  },
  field: {
    width: "100%",
    height: $height.reference,
    fontSize: $fontSize.reference,
    px: $padding.reference,
    borderRadius: $borderRadius.reference,
    minWidth: 0,
    outline: 0,
    position: "relative",
    appearance: "none",
    transitionProperty: "common",
    transitionDuration: "normal",
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});

const size = {
  lg: defineStyle({
    [$fontSize.variable]: "fontSizes.lg",
    [$padding.variable]: "space.4",
    [$borderRadius.variable]: "radii.md",
    [$height.variable]: "sizes.12",
  }),
  md: defineStyle({
    [$fontSize.variable]: "fontSizes.md",
    [$padding.variable]: "space.4",
    [$borderRadius.variable]: "radii.md",
    [$height.variable]: "sizes.10",
  }),
  sm: defineStyle({
    [$fontSize.variable]: "fontSizes.sm",
    [$padding.variable]: "space.3",
    [$borderRadius.variable]: "radii.sm",
    [$height.variable]: "sizes.8",
  }),
  xs: defineStyle({
    [$fontSize.variable]: "fontSizes.xs",
    [$padding.variable]: "space.2",
    [$borderRadius.variable]: "radii.sm",
    [$height.variable]: "sizes.6",
  }),
};

const sizes = {
  lg: definePartsStyle({
    field: size.lg,
    group: size.lg,
  }),
  md: definePartsStyle({
    field: size.md,
    group: size.md,
  }),
  sm: definePartsStyle({
    field: size.sm,
    group: size.sm,
  }),
  xs: definePartsStyle({
    field: size.xs,
    group: size.xs,
  }),
};

const getDefaults = (props: Record<string, string>) => {
  const { focusBorderColor: fc, errorBorderColor: ec } = props;
  return {
    focusBorderColor: fc || mode("blue.500", "blue.300")(props),
    errorBorderColor: ec || mode("red.500", "red.300")(props),
  };
};

const variantPrimary = definePartsStyle((props) => {
  const { focusBorderColor, errorBorderColor } = getDefaults(props);

  return {
    field: {
      border: "2px solid",
      borderColor: "transparent",
      bg: mode("blackAlpha.50", "whiteAlpha.50")(props),
      _hover: {
        bg: mode("blackAlpha.100", "whiteAlpha.100")(props),
      },
      _readOnly: {
        boxShadow: "none !important",
        userSelect: "all",
      },
      _placeholder: {
        color: "#ADADAD",
      },
      _invalid: {
        borderColor: errorBorderColor,
      },
      _focusVisible: {
        borderColor: focusBorderColor,
      },
    },
    addon: {
      border: "2px solid",
      borderColor: "transparent",
      bg: mode("blackAlpha.50", "whiteAlpha.50")(props),
    },
    element: {
      color: "#ADADAD",
    },
  };
});

const variants = {
  primary: variantPrimary,
};

export default defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: "lg",
    variant: "primary",
  },
});
