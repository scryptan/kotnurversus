import { lazy } from "react";
import paths from "./paths";

const MainPage = lazy(() => import("./MainPage"));

export default {
  main: {
    path: paths.main.pathTemplate,
    Component: MainPage,
  },
};
