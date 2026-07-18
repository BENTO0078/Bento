"use client";

import { useState } from "react";
import {
  Search,
  Zap,
  Star,
  Trophy,
  Target,
  Flame,
  Lock,
  Share2,
} from "lucide-react";
import { TwitterIcon, LinkedInIcon } from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bento.app";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  earned: boolean;
  progress?: string;
}

const achievements: Achievement[] = [
  {
    id: "first-scan",
    name: "First Scan",
    description: "Complete your first savings scan",
    icon: Search,
    earned: true,
  },
  {
    id: "subscription-slayer",
    name: "Subscription Slayer",
    description: "Cancel 5 unused subscriptions",
    icon: Zap,
    earned: false,
    progress: "2/5",
  },
  {
    id: "negotiation-ninja",
    name: "Negotiation Ninja",
    description: "Successfully negotiate 3 bills",
    icon: Star,
    earned: false,
    progress: "0/3",
  },
  {
    id: "refund-hunter",
    name: "Refund Hunter",
    description: "File 5 refund claims",
    icon: Target,
    earned: false,
    progress: "1/5",
  },
  {
    id: "streak-keeper",
    name: "Streak Keeper",
    description: "Save money 3 months in a row",
    icon: Flame,
    earned: false,
  },
  {
    id: "top-saver",
    name: "Top 10%",
    description: "Rank in the top 10% of savers",
    icon: Trophy,
    earned: false,
  },
];

function AchievementShareDialog({
  open,
  onOpenChange,
  achievement,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement | null;
}) {
  if (!achievement) return null;

  const shareMessage = `I just earned ${achievement.name} on Bento! 🎉 "${achievement.description}" Join me: ${APP_URL}`;

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleShareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(APP_URL)}`,
      "_blank"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Achievement</DialogTitle>
          <DialogDescription>
            Let your network know about your savings win!
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 p-4 text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              {(() => {
                const Icon = achievement.icon;
                return <Icon className="h-6 w-6" />;
              })()}
            </div>
          </div>
          <p className="font-semibold text-sm">{achievement.name}</p>
          <p className="text-xs text-muted-foreground">
            {achievement.description}
          </p>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleShareTwitter}
          >
            <TwitterIcon className="h-4 w-4 text-[#1DA1F2]" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleShareLinkedin}
          >
            <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" />
            LinkedIn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AchievementsRow() {
  const [shareAchievement, setShareAchievement] = useState<Achievement | null>(null);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-tight">Achievements</h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {achievements.filter((a) => a.earned).length}/{achievements.length}{" "}
            earned
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex-shrink-0 rounded-lg border p-4 w-[180px] transition-colors relative group",
                  achievement.earned
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
                    : "border-border bg-card opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "rounded-lg p-2 flex-shrink-0",
                      achievement.earned
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {achievement.earned ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={cn(
                        "text-sm font-medium truncate",
                        !achievement.earned && "text-muted-foreground"
                      )}
                    >
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {achievement.earned
                        ? achievement.description
                        : achievement.progress
                          ? achievement.progress
                          : "Locked"}
                    </p>
                  </div>
                </div>

                {/* Share button for earned achievements */}
                {achievement.earned && (
                  <button
                    onClick={() => setShareAchievement(achievement)}
                    className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Share ${achievement.name}`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AchievementShareDialog
        open={shareAchievement !== null}
        onOpenChange={(open) => {
          if (!open) setShareAchievement(null);
        }}
        achievement={shareAchievement}
      />
    </>
  );
}
