"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster } from "sonner";
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      {children}
      <Toaster
        richColors
        position="top-center"
        theme={theme as "light" | "dark" | "system" | undefined}
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  );
}
