"use client";
import { store } from "@/redux/store";
import customTheme from "@/styles/customTheme";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";

// const theme = createTheme(customTheme);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <SessionProvider session={session}>
    <SessionProvider>
      <Provider store={store}>
        {/* <CacheProvider value={emotionCache}> */}
        {/* <ThemeProvider theme={theme}> */}
        {children}
        {/* </ThemeProvider> */}
        {/* </CacheProvider> */}
      </Provider>
    </SessionProvider>
  );
}
