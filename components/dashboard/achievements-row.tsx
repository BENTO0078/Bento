"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Scan,
  XCircle,
  PhoneCall,
  Trophy,
  Lock,
} from "lucide-react";

interface Achievement {
  id: string;
  label: string;
  subtitle: string;
  earned: boolean;
  icon: React.ReactNode;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-scan",
    label: "First Scan",
    subtitle: "Complete your first savings scan",
    earned: true,
    icon: <Scan className="h-5 w-5" />,
  },
  {
    id: "subscription-slayer",
    label: "Subscription Slayer",
    subtitle: "Cancel 5 subscriptions (0/5)",
    earned: false,
    icon: <XCircle className="h-5 w-5" />,
  },
  {
    id: "negotiation-ninja",
    label: "Negotiation Ninja",
    subtitle: "Negotiate 3 bills (0/3)",
    earned: false,
    icon: <PhoneCall className="h-5 w-5" />,
  },
];

export function AchievementsRow() {
  const earnedCount = ACHIEVEMENTS.filter((a) => a.earned).length;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-tight">Achievements</h3>
        <span className="text-xs text-muted-foreground">
          {earnedCount}/{ACHIEVEMENTS.length} earned
        </span>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-1">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex-shrink-0 w-[180px] rounded-lg border p-3 transition-colors ${
                achievement.earned
                  ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10"
                  : "border-muted bg-muted/20 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Badge icon */}
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    achievement.earned
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {achievement.earned ? (
                    <Trophy className="h-5 w-5" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium leading-snug ${
                      achievement.earned
                        ? "text-emerald-800 dark:text-emerald-200"
                        : "text-muted-foreground"
                    }`}
                  >
                    {achievement.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {achievement.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
