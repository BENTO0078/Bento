"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Gift,
  Share2,
  Copy,
  Check,
  Trophy,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Medal,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://5d3bdd37f115ebfeaef09173b6dff7f4.ctonew.app";

function ReferralContent() {
  const searchParams = useSearchParams();
  const refEmail = searchParams.get("ref");

  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    const link = `${APP_URL}/referral?ref=youremail@example.com`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  // Track referral click when ref param is present
  useEffect(() => {
    if (refEmail) {
      // Fire-and-forget: track the referral click
      fetch("/api/referral/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrer_email: refEmail }),
      }).catch(() => {
        // Silently fail — tracking is best-effort
      });
    }
  }, [refEmail]);

  // Friend referral view
  if (refEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-16">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-6">
            <Users className="h-4 w-4" />
            Your friend sent you here
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            <span className="text-muted-foreground">{refEmail}</span> thinks
            you&apos;re leaking money
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Take the free 30-second scan and see how much you&apos;re losing on
            forgotten subscriptions, overpriced bills, and missed refunds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-700 transition-all"
            >
              <TrendingUp className="h-5 w-5" />
              Take the Free Scan
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md border px-8 py-3.5 text-base font-medium hover:bg-muted transition-colors"
            >
              Skip to Sign Up
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Free · 30 seconds · No signup required
          </p>
        </div>
      </div>
    );
  }

  // Main referral program page
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-transparent to-transparent dark:from-emerald-950/15 pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-6">
              <Gift className="h-4 w-4" />
              Referral Program
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Share Bento,
              <br />
              <span className="text-primary">Earn Rewards</span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl mb-8 max-w-2xl mx-auto">
              Every person you refer who signs up gets you closer to the top of
              the leaderboard. The best referrers earn exclusive perks and
              recognition.
            </p>

            {/* Referral link copy */}
            <div className="max-w-md mx-auto bg-card border rounded-xl p-5 mb-6">
              <p className="text-sm font-medium mb-3">Your referral link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-left text-xs bg-muted rounded-md px-3 py-2.5 truncate">
                  {APP_URL}/referral?ref=youremail@example.com
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Replace &quot;youremail@example.com&quot; with your email when
                sharing. Sign in to get your personalized link.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Track every click &amp; signup
                </span>
              </div>
              <div className="hidden sm:block h-5 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Medal className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Top referrers get featured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to climb the referral leaderboard
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <Share2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Copy your unique referral link and share it anywhere — social
                media, email, group chats, or carrier pigeon.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 mb-4">
                <Users className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Friends Scan</h3>
              <p className="text-sm text-muted-foreground">
                They take the 30-second leak calculator and see how much
                they&apos;re losing. The number usually shocks them into action.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 mb-4">
                <Trophy className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Climb the Board</h3>
              <p className="text-sm text-muted-foreground">
                Every signup counts. Rise through the ranks and earn bragging
                rights as one of Bento&apos;s top evangelists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground mb-4">
              <Trophy className="h-4 w-4 text-amber-500" />
              Leaderboard
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              Top Referrers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The community&apos;s best evangelists. Will you make the board?
            </p>
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            {[
              { rank: 1, name: "TopReferrer99", referrals: 47, badge: "🥇" },
              { rank: 2, name: "SavingsGuru", referrals: 38, badge: "🥈" },
              { rank: 3, name: "MoneyWizard", referrals: 31, badge: "🥉" },
              { rank: 4, name: "DealHunter42", referrals: 24, badge: "4th" },
              { rank: 5, name: "FrugalFriend", referrals: 19, badge: "5th" },
            ].map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold text-lg">
                  {entry.badge}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.referrals} referrals
                  </p>
                </div>
                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  #{entry.rank}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 rounded-lg border-2 border-dashed border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 mt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">You?</p>
                <p className="text-xs text-muted-foreground">
                  Start referring to claim your spot
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                Join Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            Ready to start referring?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Sign up for Bento, get your personalized referral link, and start
            climbing the leaderboard.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-3.5 text-base font-bold text-primary shadow-xl hover:bg-white/90 transition-all"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-8 py-3.5 text-base font-medium text-white hover:bg-white/10 transition-all"
            >
              Try the Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ReferralContent />
    </Suspense>
  );
}
