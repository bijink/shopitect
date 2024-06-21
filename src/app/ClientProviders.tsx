"use client";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store as reduxStore } from "@/redux/store";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={reduxStore}>{children}</ReduxProvider>
    </SessionProvider>
  );
}
