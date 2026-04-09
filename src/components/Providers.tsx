"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EmotionRegistry from "@/components/EmotionRegistry";
import { store } from "@/store";
import { theme } from "@/libs/theme";

type Props = {
  children: ReactNode;
};

function subscribeToHydration() {
  return () => undefined;
}

export default function Providers({ children }: Props) {
  const isToastMounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return (
    <Provider store={store}>
      <EmotionRegistry>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          {isToastMounted ? (
            <ToastContainer
              position="bottom-center"
              theme="dark"
              autoClose={3000}
              hideProgressBar
              newestOnTop
              closeOnClick
            />
          ) : null}
        </ThemeProvider>
      </EmotionRegistry>
    </Provider>
  );
}
