import { Styles } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: {
    html: {
      h: "100%",
      background: "bg.1",
      scrollBehavior: "smooth",
      scrollbarGutter: "stable",
    },
    body: {
      h: "100%",
      color: "text.main",
    },
    main: {
      h: "100%",
    },
    "#root": {
      h: "100%",
      pos: "relative",
      background: "bg.1",
    },
  },
};

export default styles;
