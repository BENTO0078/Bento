"use client";

import { useEffect } from "react";

/**
 * Registers the Bento service worker for offline caching and PWA installability.
 * Only registers in production to avoid caching dev content.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      // Only register in production
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log(
            "Bento SW registered:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Bento SW registration failed:", error);
        });
    }
  }, []);

  return null;
}
