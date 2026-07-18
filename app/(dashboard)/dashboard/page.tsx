import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { SavingsFeed } from "@/components/dashboard/savings-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AchievementsRow } from "@/components/dashboard/achievements-row";
import { UpgradeBanner } from "@/components/dashboard/upgrade-banner";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="mt-3 h-8 w-16" />
          <Skeleton className="mt-1.5 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
          <div className="flex gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderboardTeaser() {
  // Randomize slightly for visual appeal
  const rank = Math.floor(Math.random() * 5000) + 500;
  const total = 50000;

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium">
              You rank{" "}
              <span className="font-bold text-amber-600 dark:text-amber-400">
                #{rank.toLocaleString()}
              </span>{" "}
              out of{" "}
              <span className="font-medium">{total.toLocaleString()}</span>{" "}
              savers
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep saving to climb the leaderboard this month!
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/leaderboard"
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex-shrink-0"
        >
          View Full Leaderboard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {/* Mini progress bar */}
      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
          style={{ width: `${Math.max(5, ((total - rank) / total) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Upgrade Banner (free users only) */}
      <UpgradeBanner />

      {/* Stats Row */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content: Savings Feed + Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Savings Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight">
              Savings Feed
            </h2>
          </div>
          <Suspense fallback={<FeedSkeleton />}>
            <SavingsFeed />
          </Suspense>
        </div>

        {/* Sidebar: Leaderboard + Achievements */}
        <div className="space-y-4">
          <LeaderboardTeaser />
          <AchievementsRow />
        </div>
      </div>
    </div>
  );
}
