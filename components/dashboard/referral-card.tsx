"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  Mail,
  MessageCircle,
  Users,
  Gift,
  ArrowUpRight,
} from "lucide-react";
import { TwitterIcon } from "@/components/shared/social-icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/shared/auth-provider";
import { ShareCard } from "@/components/shared/share-card";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bento.app";

interface ReferralStats {
  totalReferred: number;
  creditsEarned: number;
  signedUp: number;
  subscribed: number;
}

interface ReferralCardProps {
  stats?: ReferralStats;
  className?: string;
}

export function ReferralCard({ stats, className }: ReferralCardProps) {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const referralCode = profile?.referral_code ?? "--------";
  const referralLink = `${APP_URL}/join?ref=${referralCode}`;

  const displayStats: ReferralStats = stats ?? {
    totalReferred: 0,
    creditsEarned: 0,
    signedUp: 0,
    subscribed: 0,
  };

  const shareMessage = `Bento found $847 in savings I didn't know about. Use my link to get started: ${referralLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleShareEmail = () => {
    const subject = "Check out Bento — it found savings I didn't know about!";
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  const handleShareSMS = () => {
    window.open(
      `sms:?body=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  };

  return (
    <>
      <div className={cn("rounded-lg border bg-card p-5", className)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/30 p-1.5">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="font-semibold text-sm">Invite Friends &amp; Earn</h2>
        </div>

        {/* Referral Link */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">
              Your referral link
            </label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input
                value={referralLink}
                readOnly
                className="text-xs font-mono bg-muted/50"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className={cn(
                  "flex-shrink-0 gap-1.5",
                  copied && "border-emerald-500 text-emerald-600"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleShareTwitter}
            >
              <TwitterIcon className="h-3.5 w-3.5 text-[#1DA1F2]" />
              <span className="hidden sm:inline text-xs">Twitter</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleShareEmail}
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Email</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleShareSMS}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">SMS</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={() => setShowShareModal(true)}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Share Card</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums">
              {displayStats.totalReferred}
            </p>
            <p className="text-xs text-muted-foreground">friends joined</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {displayStats.subscribed}
            </p>
            <p className="text-xs text-muted-foreground">subscribed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              ${displayStats.creditsEarned}
            </p>
            <p className="text-xs text-muted-foreground">earned in credits</p>
          </div>
        </div>

        {/* Reward Info */}
        <div className="mt-3 rounded-md bg-muted/50 p-3 flex items-start gap-2">
          <Gift className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Earn <span className="font-medium text-foreground">1 free month</span>{" "}
            for every friend who subscribes to a paid plan. They get their first
            month free too.
          </p>
        </div>
      </div>

      <ShareCard
        open={showShareModal}
        onOpenChange={setShowShareModal}
        referralCode={referralCode}
        savingsScore={
          profile?.total_savings
            ? Math.min(1000, Math.floor(profile.total_savings / 10) + 500)
            : undefined
        }
      />
    </>
  );
}
