import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import Routers from "~/pages/Routers";
import theme from "~/theme";

import "dayjs/locale/ru";

dayjs.locale("ru");

const App = () => (
  <ChakraProvider theme={theme}>
    <Routers />
  </ChakraProvider>
);

export default App;
