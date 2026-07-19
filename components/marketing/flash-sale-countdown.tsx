"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

const FLASH_SALE_DURATION_SECONDS = 24 * 60 * 60; // 24 hours

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function FlashSaleCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  const getInitialTime = useCallback(() => {
    if (typeof window === "undefined") return FLASH_SALE_DURATION_SECONDS;

    const stored = localStorage.getItem("bento-flash-sale-end");
    if (stored) {
      const endTime = Number(stored);
      const now = Date.now();
      if (endTime > now) {
        return Math.floor((endTime - now) / 1000);
      }
    }

    // First visit — set the 24h expiry
    const endTime = Date.now() + FLASH_SALE_DURATION_SECONDS * 1000;
    try {
      localStorage.setItem("bento-flash-sale-end", String(endTime));
    } catch {
      // localStorage may be unavailable in some contexts
    }
    return FLASH_SALE_DURATION_SECONDS;
  }, []);

  useEffect(() => {
    setRemaining(getInitialTime());
  }, [getInitialTime]);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  if (remaining === null) {
    return (
      <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
        <Clock className="h-5 w-5 animate-pulse" />
        <span className="text-sm font-bold">⏰ Flash Sale Ends In: --:--:--</span>
      </div>
    );
  }

  if (remaining <= 0) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-bold">⚡ Flash Sale Has Ended</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
      <Clock className="h-5 w-5 animate-pulse" />
      <span className="text-sm font-bold">
        ⏰ Flash Sale Ends In:{" "}
        <span className="tabular-nums font-mono text-base tracking-wide">
          {formatTime(remaining)}
        </span>
      </span>
    </div>
  );
}
