import { ChakraProvider } from "@chakra-ui/react";
import dayjs from "dayjs";
import Routers from "~/pages/Routers";
import theme from "~/theme";
import { AuthProvider } from "~/utils/auth-context";

import "dayjs/locale/ru";

dayjs.locale("ru");

const App = () => (
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <Routers />
    </ChakraProvider>
  </AuthProvider>
);

export default App;
