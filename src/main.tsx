import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "./Home";
import "./styles/index.css";
import { TooltipProvider } from "@/components/ui/Tooltip";
import Toaster from "@ui/Toaster";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@/queryClient";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
