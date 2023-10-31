// import { lazy } from "react";
import paths from "./paths";
import MainPage from "./MainPage";

// const MainPage = lazy(() => import("./MainPage"));

export default {
  main: {
    path: paths.main.pathTemplate,
    Component: MainPage,
  },
};
