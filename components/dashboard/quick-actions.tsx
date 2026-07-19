"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanModal } from "@/components/dashboard/scan-modal";
import { createClient } from "@/lib/supabase/client";
import { Search, Share2, UserPlus, Copy, Check } from "lucide-react";
import Link from "next/link";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://5d3bdd37f115ebfeaef09173b6dff7f4.ctonew.app";

export function QuickActions() {
  const [scanOpen, setScanOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch {
        // Not logged in or error — leave as null
      }
    };
    fetchUser();
  }, []);

  const handleShareScore = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "My Bento Savings Score",
          text: "Check out my Bento Savings Score! I'm finding money while I sleep.",
          url: window.location.origin,
        })
        .catch(() => {
          // User cancelled or share not available
        });
    } else {
      navigator.clipboard
        .writeText(
          "Check out my Bento Savings Score! I'm finding money while I sleep. " +
            window.location.origin
        )
        .catch(() => {});
    }
  }, []);

  const handleReferFriend = useCallback(async () => {
    const referralLink = userEmail
      ? `${APP_URL}/referral?ref=${encodeURIComponent(userEmail)}`
      : `${APP_URL}/referral`;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: open referral page
      window.open(`${APP_URL}/referral`, "_blank");
    }
  }, [userEmail]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Search className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Scan for Savings</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Find hidden money in your accounts
                </p>
              </div>
            </div>
            <Button
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700"
              size="sm"
              onClick={() => setScanOpen(true)}
            >
              <Search className="mr-1.5 h-4 w-4" />
              Scan Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                <Share2 className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Share Your Score</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Show off your savings streak
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              size="sm"
              onClick={handleShareScore}
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              Share
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                <UserPlus className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Refer a Friend</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {userEmail
                    ? "Copy your unique referral link"
                    : "Earn rewards for referrals"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              size="sm"
              onClick={handleReferFriend}
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-4 w-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-4 w-4" />
                  Copy Referral Link
                </>
              )}
            </Button>
            <Link
              href="/referral"
              className="block text-center text-xs text-violet-600 dark:text-violet-400 hover:underline mt-2"
            >
              View referral leaderboard →
            </Link>
          </CardContent>
        </Card>
      </div>

      <ScanModal open={scanOpen} onOpenChange={setScanOpen} />
    </>
  );
}
