"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, X, Gift } from "lucide-react";
import { ShareCard } from "@/components/shared/share-card";
import { useAuth } from "@/components/shared/auth-provider";

const STORAGE_KEY = "bento-weekly-share-dismissed";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function WeeklyShareCard() {
  const { profile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < SEVEN_DAYS_MS) {
        return;
      }
    }
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setIsVisible(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (!isVisible) return null;

  // Compute some mock weekly savings based on profile total
  const weeklySavings = profile?.total_savings
    ? Math.floor((profile.total_savings || 0) / 52)
    : 0;
  const displayWeekly = Math.max(weeklySavings, 1);

  return (
    <>
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background p-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex-shrink-0">
            <Gift className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">
              {displayWeekly > 0
                ? `You saved $${displayWeekly} this week. Share your win!`
                : "Share your Bento experience!"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Every friend you refer earns you credits toward your plan — and
              helps them save too.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleShare}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-muted-foreground"
              >
                Remind me next week
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ShareCard
        open={showShareModal}
        onOpenChange={setShowShareModal}
        referralCode={profile?.referral_code ?? undefined}
        savingsScore={
          profile?.total_savings
            ? Math.min(1000, Math.floor(profile.total_savings / 10) + 500)
            : undefined
        }
      />
    </>
  );
}
