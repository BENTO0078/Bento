"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/shared/auth-provider";
import { Button } from "@/components/ui/button";
import {
  ArrowUpCircle,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const DISMISS_KEY = "bento_upgrade_banner_dismissed";

function getStoredDismissTime(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return null;
  const ts = parseInt(raw, 10);
  return Number.isNaN(ts) ? null : ts;
}

function setStoredDismissTime() {
  if (typeof window === "undefined") return;
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

/**
 * Shown on the dashboard for free-tier users.
 * Auto-dismisses and reappears after 24 hours.
 */
export function UpgradeBanner() {
  const { profile } = useAuth();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const checkDismiss = useCallback(() => {
    const ts = getStoredDismissTime();
    if (ts && Date.now() - ts < 24 * 60 * 60 * 1000) {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    checkDismiss();
  }, [checkDismiss]);

  useEffect(() => {
    if (!profile) return;
    if (profile.plan !== "free") {
      setVisible(false);
      return;
    }
    if (dismissed) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [profile, dismissed]);

  const handleDismiss = () => {
    setStoredDismissTime();
    setDismissed(true);
    setVisible(false);
  };

  const handleUpgrade = async () => {
    // This client-side redirect approach is fallback.
    // The pricing page will call the checkout API itself.
  };

  if (!visible) return null;

  return (
    <div className="relative rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 dark:border-emerald-800/50 p-5 mb-6">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 rounded-md p-1 text-muted-foreground hover:bg-background/50 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <Sparkles className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            You&apos;re on the Free plan
          </h3>
          <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mt-0.5">
            Upgrade to automate $847 in savings. Bento works while you sleep.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/pricing">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              View Plans
            </Button>
          </Link>
          <Link href="/pricing?cta=upgrade">
            <Button
              size="sm"
              className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleUpgrade}
            >
              <ArrowUpCircle className="mr-1.5 h-4 w-4" />
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
