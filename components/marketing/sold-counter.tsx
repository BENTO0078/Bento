"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame } from "lucide-react";

function getRandomStart(): number {
  // Start between 3 and 7 for initial social proof
  return Math.floor(Math.random() * 5) + 3;
}

export default function SoldCounter() {
  const [sold, setSold] = useState<number | null>(null);

  const getInitialSold = useCallback(() => {
    if (typeof window === "undefined") return getRandomStart();

    try {
      const stored = localStorage.getItem("bento-flash-sale-sold");
      if (stored) {
        const parsed = Number(stored);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // localStorage unavailable
    }

    const start = getRandomStart();
    try {
      localStorage.setItem("bento-flash-sale-sold", String(start));
    } catch {
      // ignore
    }
    return start;
  }, []);

  useEffect(() => {
    setSold(getInitialSold());
  }, [getInitialSold]);

  useEffect(() => {
    if (sold === null) return;

    // Increment randomly every 15-45 seconds for realistic social proof
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 30000) + 15000; // 15-45 seconds
      return setTimeout(() => {
        setSold((prev) => {
          if (prev === null) return prev;
          const next = prev + 1;
          try {
            localStorage.setItem("bento-flash-sale-sold", String(next));
          } catch {
            // ignore
          }
          return next;
        });
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [sold]);

  if (sold === null) {
    return (
      <div className="flex items-center gap-1.5">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-medium text-muted-foreground">
        <span className="font-bold text-orange-600 dark:text-orange-400">
          {sold}
        </span>{" "}
        {sold === 1 ? "person has" : "people have"} claimed this deal
      </span>
    </div>
  );
}
