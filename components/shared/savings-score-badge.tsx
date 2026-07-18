"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp } from "lucide-react";

interface SavingsScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function SavingsScoreBadge({
  score,
  size = "md",
  animated = false,
  className,
}: SavingsScoreBadgeProps) {
  const [visible, setVisible] = useState(!animated);
  const [sparkle, setSparkle] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setVisible(true), 400);
      const sparkleTimer = setTimeout(() => {
        setSparkle(true);
        setTimeout(() => setSparkle(false), 1500);
      }, 800);
      return () => {
        clearTimeout(timer);
        clearTimeout(sparkleTimer);
      };
    }
  }, [animated]);

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 gap-1",
    md: "text-sm px-3.5 py-1.5 gap-1.5",
    lg: "text-base px-5 py-2.5 gap-2",
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getBgGradient = (s: number) => {
    if (s >= 800) return "bg-gradient-to-r from-emerald-600 to-emerald-500";
    if (s >= 600) return "bg-gradient-to-r from-emerald-600 to-teal-500";
    if (s >= 400) return "bg-gradient-to-r from-amber-600 to-yellow-500";
    return "bg-gradient-to-r from-gray-600 to-gray-500";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-bold text-white shadow-lg transition-all duration-700",
        getBgGradient(score),
        sizeClasses[size],
        visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-75",
        sparkle ? "ring-4 ring-emerald-300/50" : "ring-0",
        className
      )}
    >
      <TrendingUp className={cn(iconSize[size], "text-white/90")} />
      <span className="tabular-nums">Savings Score: {score.toLocaleString()}</span>
      {sparkle && (
        <Sparkles
          className={cn(
            iconSize[size],
            "text-yellow-200 animate-pulse"
          )}
        />
      )}
    </div>
  );
}
