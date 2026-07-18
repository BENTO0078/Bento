"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SavingsScoreBadge } from "@/components/shared/savings-score-badge";
import { ShareCard } from "@/components/shared/share-card";
import { createClient } from "@/lib/supabase/client";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Medal,
  Star,
  DollarSign,
  Sparkles,
  Loader2,
  Share2,
} from "lucide-react";

// ---- Demo Findings ----
interface DemoFinding {
  id: string;
  serviceName: string;
  initial: string;
  initialColor: string;
  category: string;
  costLabel: string;
  costCents: number;
  action: string;
  savingsLabel: string;
  savingsCents: number;
  type: "cancel" | "negotiate" | "refund" | "warranty" | "switch";
}

const DEMO_FINDINGS: DemoFinding[] = [
  {
    id: "netflix",
    serviceName: "Netflix",
    initial: "N",
    initialColor: "bg-red-500",
    category: "Entertainment",
    costLabel: "$15.99/mo",
    costCents: 1599,
    action: "Cancel — you haven't watched in 4 months",
    savingsLabel: "Save $15.99/mo →",
    savingsCents: 1599 * 12,
    type: "cancel",
  },
  {
    id: "comcast",
    serviceName: "Comcast Internet",
    initial: "C",
    initialColor: "bg-blue-600",
    category: "Utilities",
    costLabel: "$89/mo — market rate $49",
    costCents: 8900,
    action: "Negotiate — average savings: $40/mo",
    savingsLabel: "Save $40/mo →",
    savingsCents: 4000 * 12,
    type: "negotiate",
  },
  {
    id: "amazon",
    serviceName: "Amazon",
    initial: "A",
    initialColor: "bg-amber-500",
    category: "Shopping",
    costLabel: "$14.99/mo + $37.24 in refunds",
    costCents: 1499,
    action: "3 price drops detected — $37.24 refund available",
    savingsLabel: "Claim $37.24 →",
    savingsCents: 3724,
    type: "refund",
  },
  {
    id: "planet-fitness",
    serviceName: "Planet Fitness",
    initial: "P",
    initialColor: "bg-purple-600",
    category: "Fitness",
    costLabel: "$10/mo",
    costCents: 1000,
    action: "Cancel — no check-ins in 6 months",
    savingsLabel: "Save $10/mo →",
    savingsCents: 1000 * 12,
    type: "cancel",
  },
  {
    id: "geico",
    serviceName: "GEICO Auto",
    initial: "G",
    initialColor: "bg-green-600",
    category: "Insurance",
    costLabel: "$156/mo",
    costCents: 15600,
    action: "Switch — competitor rates as low as $112/mo",
    savingsLabel: "Save $44/mo →",
    savingsCents: 4400 * 12,
    type: "switch",
  },
  {
    id: "applecare",
    serviceName: "AppleCare+",
    initial: "A",
    initialColor: "bg-gray-600",
    category: "Warranty",
    costLabel: "iPhone coverage",
    costCents: 0,
    action: "Warranty expiring in 15 days — eligible for repair",
    savingsLabel: "Protect coverage →",
    savingsCents: 0,
    type: "warranty",
  },
  {
    id: "audible",
    serviceName: "Audible",
    initial: "A",
    initialColor: "bg-orange-500",
    category: "Entertainment",
    costLabel: "$14.95/mo",
    costCents: 1495,
    action: "Cancel — 0 credits used in 3 months",
    savingsLabel: "Save $14.95/mo →",
    savingsCents: 1495 * 12,
    type: "cancel",
  },
];

export function StepResults() {
  const router = useRouter();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [achievementVisible, setAchievementVisible] = useState(false);
  const [findingsVisible, setFindingsVisible] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const totalSavings = useMemo(
    () => DEMO_FINDINGS.reduce((sum, f) => sum + f.savingsCents, 0),
    []
  );
  const savingsScore = useMemo(() => {
    // Score based on total savings: roughly $1 = 1 point, capped
    return Math.min(Math.round(totalSavings / 100) + 100, 950);
  }, [totalSavings]);

  useEffect(() => {
    // Staggered animations
    const badgeTimer = setTimeout(() => setBadgeVisible(true), 300);
    const achievementTimer = setTimeout(() => setAchievementVisible(true), 800);
    const findingsTimer = setTimeout(() => setFindingsVisible(true), 500);
    return () => {
      clearTimeout(badgeTimer);
      clearTimeout(achievementTimer);
      clearTimeout(findingsTimer);
    };
  }, []);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    router.push("/pricing");
  };

  const handleManualContinue = async () => {
    setIsManualLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Call the API to create demo data
        await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            findings: DEMO_FINDINGS.map((f) => ({
              id: f.id,
              serviceName: f.serviceName,
              type: f.type,
              costCents: f.costCents,
              savingsCents: f.savingsCents,
              category: f.category,
            })),
          }),
        });

        // Update profile on client side too
        await supabase
          .from("profiles")
          .update({ onboarding_completed: true })
          .eq("id", user.id);

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsManualLoading(false);
    }
  };

  const getTypeBadge = (type: DemoFinding["type"]) => {
    switch (type) {
      case "cancel":
        return { label: "Cancel", className: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" };
      case "negotiate":
        return { label: "Negotiate", className: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" };
      case "refund":
        return { label: "Refund", className: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" };
      case "warranty":
        return { label: "Warranty", className: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" };
      case "switch":
        return { label: "Switch & Save", className: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" };
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] px-4 py-6">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        {/* ---- HEADER ---- */}
        <div
          className={cn(
            "text-center space-y-4 transition-all duration-700",
            badgeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* Big savings number */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              First scan complete
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              We found{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                {formatCurrency(totalSavings / 100)}
              </span>{" "}
              in potential savings
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&apos;s what Bento can do about it — automatically.
            </p>
          </div>

          {/* Savings Score */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SavingsScoreBadge
              score={savingsScore}
              size="lg"
              animated
            />
          </div>
        </div>

        {/* Achievement popup */}
        <div
          className={cn(
            "transition-all duration-500",
            achievementVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95"
          )}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Medal className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Achievement Unlocked!</p>
                <p className="text-xs text-muted-foreground">
                  🔍 First Scan Badge Earned — You&apos;re on your way to
                  Savings Score mastery.
                </p>
              </div>
              <Star className="h-4 w-4 text-amber-500 animate-pulse shrink-0" />
            </CardContent>
          </Card>
        </div>

        {/* ---- FINDINGS LIST ---- */}
        <div
          className={cn(
            "space-y-3 transition-all duration-700",
            findingsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-500" />
            Savings Opportunities
          </h2>

          {DEMO_FINDINGS.map((finding, i) => (
            <Card
              key={finding.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
              style={{
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white",
                      finding.initialColor
                    )}
                  >
                    {finding.initial}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm">
                        {finding.serviceName}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          getTypeBadge(finding.type).className
                        )}
                      >
                        {getTypeBadge(finding.type).label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {finding.action}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {finding.costLabel}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-medium text-xs whitespace-nowrap"
                      onClick={handleUpgrade}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {finding.savingsLabel}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---- BOTTOM CTA ---- */}
        <div
          className={cn(
            "space-y-4 text-center transition-all duration-700 delay-300",
            findingsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[320px] bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold shadow-xl shadow-emerald-500/25 transition-all hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 py-6"
            onClick={handleUpgrade}
            disabled={isUpgrading}
          >
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Automate All Savings — Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <div>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground text-sm"
              onClick={handleManualContinue}
              disabled={isManualLoading}
            >
              {isManualLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  I&apos;ll do it manually
                  <ArrowRight className="ml-1 h-3 w-3" />
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span>
              Free 30-day trial. Cancel anytime. Instant results after upgrade.
            </span>
          </div>

          {/* Share your score */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto gap-2 font-medium"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Share Your Savings Score
            </Button>
          </div>
        </div>
      </div>

      {/* Share Card Modal */}
      <ShareCard
        open={shareOpen}
        onOpenChange={setShareOpen}
        savingsScore={savingsScore}
        totalFound={totalSavings / 100}
        rank={Math.floor(Math.random() * 5000) + 500}
        totalUsers={50000}
      />
    </div>
  );
}
