import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Leaderboard — Bento",
  description:
    "See the top savers on Bento. Join thousands of people who save money automatically on subscriptions, bills, refunds, and more.",
  openGraph: {
    title: "Bento Savings Leaderboard",
    description:
      "See who's saving the most with Bento. Join the leaderboard today.",
  },
};

// Demo leaderboard data — in production, this would come from Supabase
const TOP_SAVERS = [
  {
    rank: 1,
    score: 947,
    totalSaved: 3247,
    achievements: ["Subscription Slayer", "Negotiation Ninja", "Refund Hunter"],
  },
  {
    rank: 2,
    score: 932,
    totalSaved: 2980,
    achievements: ["Subscription Slayer", "Warranty Warrior", "Streak Keeper"],
  },
  {
    rank: 3,
    score: 918,
    totalSaved: 2745,
    achievements: ["Negotiation Ninja", "Refund Hunter", "Streak Keeper"],
  },
  {
    rank: 4,
    score: 901,
    totalSaved: 2510,
    achievements: ["Subscription Slayer", "Price Drop Pro"],
  },
  {
    rank: 5,
    score: 887,
    totalSaved: 2390,
    achievements: ["Negotiation Ninja", "Streak Keeper", "Top 10%"],
  },
  {
    rank: 6,
    score: 872,
    totalSaved: 2180,
    achievements: ["Refund Hunter", "Subscription Slayer"],
  },
  {
    rank: 7,
    score: 856,
    totalSaved: 2045,
    achievements: ["Negotiation Ninja", "Top 10%", "Streak Keeper"],
  },
  {
    rank: 8,
    score: 840,
    totalSaved: 1920,
    achievements: ["Subscription Slayer", "Warranty Warrior"],
  },
  {
    rank: 9,
    score: 825,
    totalSaved: 1830,
    achievements: ["Refund Hunter", "Price Drop Pro"],
  },
  {
    rank: 10,
    score: 812,
    totalSaved: 1745,
    achievements: ["Streak Keeper", "Negotiation Ninja"],
  },
  {
    rank: 11,
    score: 798,
    totalSaved: 1680,
    achievements: ["Subscription Slayer"],
  },
  {
    rank: 12,
    score: 784,
    totalSaved: 1590,
    achievements: ["Refund Hunter", "Top 10%"],
  },
  {
    rank: 13,
    score: 771,
    totalSaved: 1520,
    achievements: ["Negotiation Ninja"],
  },
  {
    rank: 14,
    score: 758,
    totalSaved: 1460,
    achievements: ["Streak Keeper", "Subscription Slayer"],
  },
  {
    rank: 15,
    score: 745,
    totalSaved: 1390,
    achievements: ["Price Drop Pro"],
  },
  {
    rank: 16,
    score: 732,
    totalSaved: 1320,
    achievements: ["Refund Hunter"],
  },
  {
    rank: 17,
    score: 719,
    totalSaved: 1250,
    achievements: ["Subscription Slayer", "Top 10%"],
  },
  {
    rank: 18,
    score: 706,
    totalSaved: 1180,
    achievements: ["Negotiation Ninja"],
  },
  {
    rank: 19,
    score: 693,
    totalSaved: 1110,
    achievements: ["Streak Keeper"],
  },
  {
    rank: 20,
    score: 680,
    totalSaved: 1045,
    achievements: ["Subscription Slayer"],
  },
];

const TOTAL_SAVED = 2487500; // $2,487,500 aggregate
const TOTAL_USERS = 50000;

const ACHIEVEMENT_STYLES: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  "Subscription Slayer": {
    icon: <Zap className="h-3 w-3" />,
    label: "Subscription Slayer",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
  "Negotiation Ninja": {
    icon: <TrendingUp className="h-3 w-3" />,
    label: "Negotiation Ninja",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  "Refund Hunter": {
    icon: <Sparkles className="h-3 w-3" />,
    label: "Refund Hunter",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  "Warranty Warrior": {
    icon: <Star className="h-3 w-3" />,
    label: "Warranty Warrior",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "Streak Keeper": {
    icon: <Star className="h-3 w-3" />,
    label: "Streak Keeper",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  "Price Drop Pro": {
    icon: <TrendingUp className="h-3 w-3" />,
    label: "Price Drop Pro",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  "Top 10%": {
    icon: <Trophy className="h-3 w-3" />,
    label: "Top 10%",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
              B
            </div>
            <span className="text-primary">Bento</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12 lg:py-20">
          {/* Hero CTA */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>
                {TOTAL_USERS.toLocaleString()}+ people are saving with Bento
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
              Top Savers Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              See who&apos;s crushing it on Bento. All names are anonymized — but
              the savings are real.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-5 py-2 text-lg font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-5 w-5" />
              Bento users have saved {formatCurrency(TOTAL_SAVED)} total
            </div>
          </div>

          {/* CTA Banner */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 mb-12 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">
              Want to see your name up there?
            </h2>
            <p className="text-white/90 mb-6">
              Join Bento and start climbing the leaderboard with every dollar
              saved. Free scan, instant results.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg hover:bg-white/95 transition-all hover:scale-105"
            >
              <Zap className="h-5 w-5" />
              Start Your Free Scan
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Podium — Top 3 */}
          <div className="grid gap-6 sm:grid-cols-3 mb-12">
            {TOP_SAVERS.slice(0, 3).map((saver, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const gradients = [
                "from-amber-400 to-yellow-500",
                "from-gray-300 to-gray-400",
                "from-amber-600 to-orange-500",
              ];

              return (
                <div
                  key={saver.rank}
                  className={cn(
                    "rounded-xl border bg-card p-6 text-center relative overflow-hidden",
                    i === 0 && "ring-2 ring-amber-400 shadow-lg shadow-amber-100 dark:shadow-amber-900/20"
                  )}
                >
                  <div className="text-4xl mb-2">{medals[i]}</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Rank #{saver.rank}
                  </div>
                  <div
                    className={cn(
                      "text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent",
                      gradients[i]
                    )}
                  >
                    {saver.score}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">
                    Savings Score
                  </div>
                  <div className="mt-3 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(saver.totalSaved)} saved
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-3">
                    {saver.achievements.slice(0, 2).map((a) => {
                      const style = ACHIEVEMENT_STYLES[a] || {
                        icon: <Star className="h-3 w-3" />,
                        label: a,
                        color:
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                      };
                      return (
                        <span
                          key={a}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            style.color
                          )}
                        >
                          {style.icon}
                          {style.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Leaderboard Table */}
          <div className="rounded-xl border overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-3">Total Saved</div>
              <div className="col-span-6">Achievements</div>
            </div>

            {/* Table Body */}
            <div className="divide-y">
              {TOP_SAVERS.map((saver) => (
                <div
                  key={saver.rank}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
                >
                  {/* Rank */}
                  <div className="sm:col-span-1 flex items-center gap-2">
                    {saver.rank <= 3 ? (
                      <span className="text-xl">
                        {["🥇", "🥈", "🥉"][saver.rank - 1]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold text-muted-foreground">
                        {saver.rank}
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <div className="sm:hidden text-xs text-muted-foreground w-16">
                      Score:
                    </div>
                    <span className="font-bold text-lg">{saver.score}</span>
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>

                  {/* Total Saved */}
                  <div className="sm:col-span-3">
                    <div className="sm:hidden text-xs text-muted-foreground">
                      Saved:
                    </div>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(saver.totalSaved)}
                    </span>
                  </div>

                  {/* Achievements */}
                  <div className="sm:col-span-6 flex flex-wrap gap-1.5">
                    {saver.achievements.map((a) => {
                      const style = ACHIEVEMENT_STYLES[a] || {
                        icon: <Star className="h-3 w-3" />,
                        label: a,
                        color:
                          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                      };
                      return (
                        <span
                          key={a}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            style.color
                          )}
                        >
                          {style.icon}
                          {style.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="rounded-xl bg-muted/50 border p-8 sm:p-12">
              <h3 className="text-2xl font-bold mb-3">
                Ready to join the leaderboard?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Every dollar you save with Bento increases your Savings Score.
                Start climbing today.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-8 py-4 text-base font-medium text-white shadow-lg hover:bg-emerald-700 transition-all"
              >
                Start Free Scan
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                No credit card required · 30-day free trial
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-10">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bento. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
