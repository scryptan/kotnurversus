import {
  ThemeConfig,
  theme as chakraTheme,
  extendTheme,
} from "@chakra-ui/react";
import styles from "./styles";

const config: ThemeConfig = {
  initialColorMode: "light",
};

// https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/theme/src

const theme = extendTheme({
  components: chakraTheme.components,
  styles,
  config,
});

export default theme;
