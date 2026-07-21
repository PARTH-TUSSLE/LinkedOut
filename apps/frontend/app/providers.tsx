"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
}
