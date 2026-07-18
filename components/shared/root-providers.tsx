"use client";

import { AuthProvider } from "@/components/shared/auth-provider";
import { Toaster } from "@/components/ui/toaster";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
