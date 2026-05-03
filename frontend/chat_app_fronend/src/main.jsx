import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Kick off a health-check ping immediately so the Render server starts
// waking up as early as possible — before React even mounts.
fetch("/health").catch(() => {});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // treat data as fresh for 5 min
            gcTime: 10 * 60 * 1000,         // keep unused data in cache for 10 min
            retry: 1,                        // retry once on failure, then show error
            refetchOnWindowFocus: false,     // don't refetch just because user switches tabs
            refetchOnReconnect: true,        // do refetch when network comes back
        },
        mutations: {
            retry: 0,                        // don't retry mutations — side effects aren't idempotent
        },
    },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
