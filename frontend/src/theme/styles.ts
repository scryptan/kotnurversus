import { Styles } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: ({ colorMode }) => ({
    html: {
      h: "100%",
      background: `bg.${colorMode}.1`,
      scrollBehavior: "smooth",
      scrollbarGutter: "stable",
    },
    body: {
      h: "100%",
      color: `text.${colorMode}.main`,
      "&::-webkit-scrollbar": {
        w: "8px",
        h: "8px",
        background: `bg.${colorMode}.1`,
      },
      "&::-webkit-scrollbar-thumb": {
        bg: colorMode === "light" ? "#00000029" : "#ffffff29",
      },
    },
    main: {
      h: "100%",
    },
    "#root": {
      h: "100%",
      pos: "relative",
      background: `bg.${colorMode}.1`,
    },
  }),
};

export default styles;
