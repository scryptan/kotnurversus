import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "~/pages/ErrorPage";
import Routers from "~/pages/Routers";
import theme from "~/theme";
import { AuthProvider } from "~/utils/auth-context";
import "~/utils/extensions";

setDefaultOptions({ locale: ru });

const queryClient = new QueryClient();

const App = () => (
  <ChakraProvider theme={theme}>
    <ErrorBoundary fallback={<ErrorPage />}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routers />
          <ReactQueryDevtools />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </ChakraProvider>
);

export default App;
