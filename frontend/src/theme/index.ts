import {
  ThemeConfig,
  theme as chakraTheme,
  extendTheme,
} from "@chakra-ui/react";
import * as components from "./components";
import styles from "./styles";
import foundations from "./foundations";

const config: ThemeConfig = {
  initialColorMode: "dark",
};

// https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/theme/src

const theme = extendTheme({
  ...foundations,
  components: { ...chakraTheme.components, ...components },
  styles,
  config,
});

export default theme;
