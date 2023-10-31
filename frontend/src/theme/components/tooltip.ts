import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
import { cssVar } from "@chakra-ui/theme-tools";

const $bg = cssVar("tooltip-bg");
const $fg = cssVar("tooltip-fg");
const $arrowBg = cssVar("popper-arrow-bg");

const baseStyle = defineStyle({
  bg: $bg.reference,
  color: $fg.reference,
  [$bg.variable]: "colors.gray.900",
  [$fg.variable]: "colors.white",
  _dark: {
    [$bg.variable]: "colors.gray.300",
    [$fg.variable]: "colors.gray.900",
  },
  [$arrowBg.variable]: $bg.reference,
  px: "2",
  py: "0.5",
  borderRadius: 4,
  fontWeight: "medium",
  fontSize: "sm",
  boxShadow: "md",
  maxW: "xs",
  zIndex: "tooltip",
});

export default defineStyleConfig({
  baseStyle,
});
