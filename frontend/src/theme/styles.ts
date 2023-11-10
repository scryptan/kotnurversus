import { Styles } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: ({ colorMode }) => ({
    html: {
      h: "100%",
      background: colorMode === "light" ? "bg.light.1" : "bg.dark.2",
      scrollBehavior: "smooth",
      scrollbarGutter: "stable",
    },
    body: {
      h: "100%",
      color: `text.${colorMode}.main`,
      "&::-webkit-scrollbar": {
        w: "8px",
        h: "8px",
        background: colorMode === "light" ? "bg.light.1" : "bg.dark.2",
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
      background: colorMode === "light" ? "bg.light.1" : "bg.dark.2",
    },
  }),
};

export default styles;
