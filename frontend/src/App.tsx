import { ChakraProvider } from "@chakra-ui/react";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import Routers from "~/pages/Routers";
import theme from "~/theme";
import { AuthProvider } from "~/utils/auth-context";
import "~/utils/extensions";

setDefaultOptions({ locale: ru });

const App = () => (
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <Routers />
    </ChakraProvider>
  </AuthProvider>
);

export default App;
