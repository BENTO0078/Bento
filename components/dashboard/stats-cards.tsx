import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  RefreshCw,
  Clock,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconFgClass: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgClass,
  iconFgClass,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBgClass}`}
          >
            <div className={iconFgClass}>{icon}</div>
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function formatDollars(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}

function computeSavingsScore(totalSavingsCents: number): number {
  // Simple scoring: 1 point per dollar saved, plus bonus tiers
  const dollars = totalSavingsCents / 100;
  let score = Math.floor(dollars);
  if (dollars >= 1000) score += 100;
  if (dollars >= 500) score += 50;
  if (dollars >= 100) score += 10;
  return score;
}

export async function DashboardStats() {
  const supabase = createClient();

  let totalSavings = "$0";
  let savingsScore = "0";
  let activeSubscriptions = "0";
  let pendingRefunds = "0";
  let savingsSubtitle = "Lifetime savings";
  let scoreSubtitle = "Savings Score";
  let subsSubtitle = "Across all accounts";
  let refundsSubtitle = "Awaiting resolution";

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_savings")
        .eq("id", user.id)
        .single();

      if (profile) {
        const totalCents = profile.total_savings ?? 0;
        totalSavings = formatDollars(totalCents);
        savingsScore = computeSavingsScore(totalCents).toLocaleString();
        savingsSubtitle = totalCents > 0 ? "Lifetime savings" : "No savings yet";
        scoreSubtitle =
          totalCents > 0 ? "Keep it up!" : "Start saving to earn points";
      }

      // Fetch active subscriptions count
      const { count: subCount } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id)
        .eq("status", "active");

      if (subCount !== null) {
        activeSubscriptions = subCount.toString();
        subsSubtitle =
          subCount > 0 ? "Across all accounts" : "No active subscriptions";
      }

      // Fetch pending refunds count
      const { count: refundCount } = await supabase
        .from("refunds")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.id)
        .eq("status", "pending");

      if (refundCount !== null) {
        pendingRefunds = refundCount.toString();
        refundsSubtitle =
          refundCount > 0 ? "Awaiting resolution" : "No pending refunds";
      }
    }
  } catch {
    // Silently fall back to zero values — user may not be authenticated
    // or tables may not exist yet
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Savings"
        value={totalSavings}
        subtitle={savingsSubtitle}
        icon={<DollarSign className="h-5 w-5" />}
        iconBgClass="bg-emerald-50 dark:bg-emerald-900/30"
        iconFgClass="text-emerald-600 dark:text-emerald-400"
      />
      <StatCard
        title="Savings Score"
        value={savingsScore}
        subtitle={scoreSubtitle}
        icon={<TrendingUp className="h-5 w-5" />}
        iconBgClass="bg-amber-50 dark:bg-amber-900/30"
        iconFgClass="text-amber-600 dark:text-amber-400"
      />
      <StatCard
        title="Active Subscriptions"
        value={activeSubscriptions}
        subtitle={subsSubtitle}
        icon={<RefreshCw className="h-5 w-5" />}
        iconBgClass="bg-blue-50 dark:bg-blue-900/30"
        iconFgClass="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        title="Pending Refunds"
        value={pendingRefunds}
        subtitle={refundsSubtitle}
        icon={<Clock className="h-5 w-5" />}
        iconBgClass="bg-violet-50 dark:bg-violet-900/30"
        iconFgClass="text-violet-600 dark:text-violet-400"
      />
    </div>
  );
}
