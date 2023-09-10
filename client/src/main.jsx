import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { store } from "./store.jsx";
import { Provider } from "react-redux";
const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const helpers = createMultiStyleConfigHelpers(["menu", "item"]);

const Menu = helpers.defineMultiStyleConfig({
  baseStyle: {
    menu: {
      boxShadow: "lg",
      rounded: "lg",
      flexDirection: "column",
      py: "2",
    },
    item: {
      fontWeight: "medium",
      lineHeight: "normal",
      color: "#616161",
    },
  },
  sizes: {
    sm: {
      item: {
        fontSize: "0.75rem",
        px: 2,
        py: 1,
      },
    },
    md: {
      item: {
        fontSize: "1rem",
        px: 3,
        py: 2,
      },
    },
  },
  defaultProps: {
    size: {
      base: "sm",
      sm: "md",
      md: "md",
    },
  },
});

const theme = extendTheme({
  config,
  styles,
  colors,
  components: {
    Menu,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  // </React.StrictMode>
);
