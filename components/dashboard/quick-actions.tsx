"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanModal } from "@/components/dashboard/scan-modal";
import { Search, Share2, UserPlus } from "lucide-react";

export function QuickActions() {
  const [scanOpen, setScanOpen] = useState(false);

  const handleShareScore = () => {
    // Placeholder: share functionality
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
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(
          "Check out my Bento Savings Score! I'm finding money while I sleep. " +
            window.location.origin
        )
        .catch(() => {});
    }
  };

  const handleInviteFriend = () => {
    // Placeholder: invite functionality
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Join Bento with me",
          text: "Join Bento and start finding hidden savings. It works while you sleep!",
          url: window.location.origin + "/signup",
        })
        .catch(() => {});
    } else {
      navigator.clipboard
        .writeText(
          "Join Bento and start finding hidden savings: " +
            window.location.origin +
            "/signup"
        )
        .catch(() => {});
    }
  };

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
                <p className="text-sm font-medium">Invite a Friend</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Earn rewards for referrals
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3"
              size="sm"
              onClick={handleInviteFriend}
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Invite
            </Button>
          </CardContent>
        </Card>
      </div>

      <ScanModal open={scanOpen} onOpenChange={setScanOpen} />
    </>
  );
}
