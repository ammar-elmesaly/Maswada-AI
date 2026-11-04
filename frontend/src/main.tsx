import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "@/app/App"
import { ClerkProvider } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LanguageProvider } from "./app/contexts/LanguageProvider";
import { IntlWrapper } from "./components/common/IntlWrapper";
import { ThemeProvider } from "./app/contexts/ThemeProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

const queryClient = new QueryClient();


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="maswada-theme">
        <IntlWrapper>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <QueryClientProvider client={queryClient}>
              <App />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ClerkProvider>
        </IntlWrapper>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
)
