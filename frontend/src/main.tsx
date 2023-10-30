import { ColorModeScript } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import theme from "./theme";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </StrictMode>
  );
}
