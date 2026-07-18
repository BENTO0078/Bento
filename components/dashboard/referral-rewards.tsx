"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface ReferralReward {
  id: string;
  referred_email: string | null;
  referred_user_id: string | null;
  status: "pending" | "signed_up" | "subscribed" | "paid";
  reward_cents: number;
  reward_type: "credit" | "cash" | "months_free";
  created_at: string;
}

interface ReferralRewardsProps {
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pending: {
    label: "Invited",
    icon: Clock,
    color: "bg-muted text-muted-foreground",
  },
  signed_up: {
    label: "Signed Up",
    icon: Users,
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
  },
  subscribed: {
    label: "Subscribed",
    icon: TrendingUp,
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
  paid: {
    label: "Reward Earned",
    icon: CheckCircle2,
    color:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300",
  },
};

export function ReferralRewards({ className }: ReferralRewardsProps) {
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchRewards = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("referrals")
      .select(
        "id, referred_email, referred_user_id, status, reward_cents, reward_type, created_at"
      )
      .eq("referrer_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setRewards(data as ReferralReward[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const earnedRewards = rewards.filter(
    (r) => r.status === "subscribed" || r.status === "paid"
  );
  const totalEarnedCredits = earnedRewards.reduce(
    (sum, r) => sum + r.reward_cents,
    0
  );
  const totalFreeMonths = earnedRewards.filter(
    (r) => r.reward_type === "months_free"
  ).length;

  const pendingRewards = rewards.filter(
    (r) => r.status === "pending" || r.status === "signed_up"
  );

  if (loading) {
    return (
      <div className={cn("rounded-lg border bg-card p-5", className)}>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className={cn("rounded-lg border bg-card p-5", className)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 p-1.5">
            <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-semibold text-sm">Referral Rewards</h2>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            No referral rewards yet. Share your link above to start earning!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 p-1.5">
            <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-semibold text-sm">Referral Rewards</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRewards}
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Earned Summary */}
      {(totalEarnedCredits > 0 || totalFreeMonths > 0) && (
        <div className="rounded-md bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-3 mb-4">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {totalFreeMonths > 0
              ? `You've earned ${totalFreeMonths} free month${totalFreeMonths > 1 ? "s" : ""} from referrals`
              : totalEarnedCredits > 0
                ? `You've earned ${formatCurrency(totalEarnedCredits / 100)} in credits`
                : "Start earning rewards!"}
          </p>
          {pendingRewards.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {pendingRewards.length} pending — once they subscribe, you earn!
            </p>
          )}
        </div>
      )}

      {/* Rewards List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {rewards.map((reward) => {
          const statusConfig = STATUS_CONFIG[reward.status] ?? STATUS_CONFIG.pending;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={reward.id}
              className="flex items-center justify-between rounded-md border bg-muted/30 p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
                    statusConfig.color
                  )}
                >
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {reward.referred_email ?? "Friend"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reward.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {reward.status === "paid" ? (
                  <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 border-amber-200 dark:border-amber-800">
                    +{reward.reward_type === "months_free" ? "1 mo" : formatCurrency(reward.reward_cents / 100)}
                  </Badge>
                ) : (
                  <Badge variant="outline" className={cn("text-xs", statusConfig.color)}>
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
