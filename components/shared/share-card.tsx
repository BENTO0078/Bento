"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/shared/auth-provider";
import {
  X,
  Copy,
  Check,
  Download,
  Trophy,
  Zap,
  Star,
  Target,
  Flame,
  Share2,
} from "lucide-react";
import { TwitterIcon, LinkedInIcon } from "./social-icons";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bento.app";

interface AchievementBadge {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const achievementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "first-scan": Trophy,
  "subscription-slayer": Zap,
  "negotiation-ninja": Star,
  "refund-hunter": Target,
  "streak-keeper": Flame,
};

interface ShareCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingsScore?: number;
  monthlySavings?: number;
  yearlySavings?: number;
  earnedAchievements?: AchievementBadge[];
  referralCode?: string;
}

const SHARE_MESSAGES = {
  twitter: (score: number, savings: number, link: string) =>
    `My Bento Savings Score is ${score} 📊 Found $${savings} in savings this year. Try it free: ${link}`,
  linkedin: (score: number, savings: number, link: string) =>
    `I just hit a Savings Score of ${score} on Bento — recovered $${savings} in wasted subscriptions and bills. Check it out: ${link}`,
};

export function ShareCard({
  open,
  onOpenChange,
  savingsScore = 0,
  monthlySavings = 0,
  yearlySavings = 0,
  earnedAchievements = [],
  referralCode,
}: ShareCardProps) {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const displayScore = savingsScore || profile?.total_savings
    ? Math.min(1000, Math.floor((profile?.total_savings ?? 0) / 10) + 500)
    : 0;
  const displayYearly = yearlySavings || (monthlySavings * 12) || (profile?.total_savings ?? 0);
  const shareLink = referralCode
    ? `${APP_URL}/join?ref=${referralCode}`
    : profile?.referral_code
      ? `${APP_URL}/join?ref=${profile.referral_code}`
      : APP_URL;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleShareTwitter = () => {
    const text = SHARE_MESSAGES.twitter(displayScore, displayYearly, shareLink);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleShareLinkedin = () => {
    const text = SHARE_MESSAGES.linkedin(displayScore, displayYearly, shareLink);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`,
      "_blank"
    );
  };

  const handleCopyImage = async () => {
    // In production, this would render to a canvas and copy as PNG
    // For now, copy the share text as a fallback
    const text = SHARE_MESSAGES.twitter(displayScore, displayYearly, shareLink);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const displayAchievements = earnedAchievements.length > 0
    ? earnedAchievements
    : [
        { id: "first-scan", name: "First Scan", icon: Trophy },
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-emerald-600" />
            Share Your Savings
          </DialogTitle>
          <DialogDescription>
            Let your friends see how much you&apos;ve saved with Bento.
          </DialogDescription>
        </DialogHeader>

        {/* Share Card Preview */}
        <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                B
              </div>
              <span className="text-sm font-semibold">Bento</span>
            </div>
            <span className="text-xs text-muted-foreground">Join me</span>
          </div>

          {/* Savings Score - Hero Number */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Savings Score
            </p>
            <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {displayScore}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/60 dark:bg-muted/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">Saved This Year</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ${displayYearly.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-white/60 dark:bg-muted/30 p-3 text-center">
              <p className="text-xs text-muted-foreground">Achievements</p>
              <div className="flex justify-center gap-1 mt-1">
                {displayAchievements.slice(0, 3).map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.id}
                      className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      title={a.name}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Referral link */}
          <div className="rounded-lg bg-white/60 dark:bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground text-center truncate">
              {shareLink}
            </p>
          </div>
        </div>

        {/* Share Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleShareTwitter}
          >
            <TwitterIcon className="h-4 w-4 text-[#1DA1F2]" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleShareLinkedin}
          >
            <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" />
            <span className="hidden sm:inline">LinkedIn</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={handleCopyImage}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
