import { ChakraProvider } from "@chakra-ui/react";
import Routers from "~/pages/Routers";
import theme from "~/theme";

const App = () => (
  <ChakraProvider theme={theme}>
    <Routers />
  </ChakraProvider>
);

export default App;
