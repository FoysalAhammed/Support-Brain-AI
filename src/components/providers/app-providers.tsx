"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-provider";
import { ThemeProvider } from "./theme-provider";
import type { Organization } from "@/types/organization";

export function AppProviders({
  children,
  organizations,
}: {
  children: React.ReactNode;
  organizations: Organization[];
}) {
  return (
    <ThemeProvider>
      <AuthProvider organizations={organizations}>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "!rounded-xl !border-border !bg-card !text-foreground !shadow-lg",
            }}
          />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
