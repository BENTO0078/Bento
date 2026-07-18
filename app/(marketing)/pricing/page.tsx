"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, Sparkles, Zap, Users, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  CONSUMER_MONTHLY_PRICE_ID,
  CONSUMER_ANNUAL_PRICE_ID,
  FAMILY_MONTHLY_PRICE_ID,
  FAMILY_ANNUAL_PRICE_ID,
  CONCIERGE_MONTHLY_PRICE_ID,
} from "@/lib/stripe/prices";

type BillingInterval = "monthly" | "annual";

interface Tier {
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  priceIdMonthly: string;
  priceIdAnnual: string;
  featured: boolean;
  icon: React.ReactNode;
  isFree?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    description:
      "See what Bento finds — then decide if you want automation.",
    features: [
      "Detect active subscriptions",
      "View potential savings",
      "Basic bill scan",
      "Savings Score & badges",
      "Leaderboard ranking",
      "Weekly summary email",
    ],
    cta: "Start Free Trial",
    priceIdMonthly: "",
    priceIdAnnual: "",
    featured: false,
    icon: <Sparkles className="h-5 w-5 text-muted-foreground" />,
    isFree: true,
  },
  {
    name: "Consumer",
    monthlyPrice: 19,
    description:
      "All automations for individuals who want to save without lifting a finger.",
    features: [
      "Everything in Free",
      "Auto-cancel subscriptions",
      "Auto-negotiate bills",
      "Auto-file refunds",
      "Price-drop alerts",
      "Warranty tracking",
      "Unlimited linked accounts",
      "Credit monitoring",
      "Weekly savings report",
    ],
    cta: "Subscribe",
    priceIdMonthly: CONSUMER_MONTHLY_PRICE_ID,
    priceIdAnnual: CONSUMER_ANNUAL_PRICE_ID,
    featured: true,
    icon: <Zap className="h-5 w-5 text-emerald-600" />,
  },
  {
    name: "Family",
    monthlyPrice: 49,
    description:
      "For households — up to 4 members, shared savings dashboard.",
    features: [
      "Everything in Consumer",
      "Up to 4 family members",
      "Shared savings dashboard",
      "Family warranty tracking",
      "Joint account support",
      "Priority support",
    ],
    cta: "Subscribe",
    priceIdMonthly: FAMILY_MONTHLY_PRICE_ID,
    priceIdAnnual: FAMILY_ANNUAL_PRICE_ID,
    featured: false,
    icon: <Users className="h-5 w-5 text-blue-600" />,
  },
  {
    name: "Concierge",
    monthlyPrice: 99,
    description:
      "White-glove service with human-in-the-loop for complex cases.",
    features: [
      "Everything in Family",
      "Human-in-the-loop support",
      "Complex negotiations handled",
      "Insurance appeals",
      "Medical bill audits",
      "Dedicated account manager",
      "Same-day response",
    ],
    cta: "Subscribe",
    priceIdMonthly: CONCIERGE_MONTHLY_PRICE_ID,
    priceIdAnnual: "",
    featured: false,
    icon: <Headphones className="h-5 w-5 text-purple-600" />,
  },
];

/** Feature keys for the comparison grid */
const comparisonFeatures = [
  { label: "Subscription detection", free: true, consumer: true, family: true, concierge: true },
  { label: "Bill scanning", free: true, consumer: true, family: true, concierge: true },
  { label: "Savings Score", free: true, consumer: true, family: true, concierge: true },
  { label: "Leaderboard", free: true, consumer: true, family: true, concierge: true },
  { label: "Auto-cancel subscriptions", free: false, consumer: true, family: true, concierge: true },
  { label: "Auto-negotiate bills", free: false, consumer: true, family: true, concierge: true },
  { label: "Auto-file refunds", free: false, consumer: true, family: true, concierge: true },
  { label: "Price-drop alerts", free: false, consumer: true, family: true, concierge: true },
  { label: "Warranty tracking", free: false, consumer: true, family: true, concierge: true },
  { label: "Credit monitoring", free: false, consumer: true, family: true, concierge: true },
  { label: "Family members (up to 4)", free: false, consumer: false, family: true, concierge: true },
  { label: "Joint account support", free: false, consumer: false, family: true, concierge: true },
  { label: "Priority support", free: false, consumer: false, family: true, concierge: true },
  { label: "Human-in-the-loop", free: false, consumer: false, family: false, concierge: true },
  { label: "Dedicated account manager", free: false, consumer: false, family: false, concierge: true },
  { label: "Medical bill audits", free: false, consumer: false, family: false, concierge: true },
];

function formatPrice(monthlyPrice: number, interval: BillingInterval): string {
  if (monthlyPrice === 0) return "$0";
  if (interval === "annual") {
    const annualTotal = monthlyPrice * 10; // 2 months free
    const perMonth = annualTotal / 12;
    return `$${perMonth.toFixed(2)}`;
  }
  return `$${monthlyPrice}`;
}

export default function PricingPage() {
  const { toast } = useToast();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleSubscribe = useCallback(
    async (tier: Tier) => {
      if (tier.isFree) {
        // Navigate to signup
        window.location.href = "/signup";
        return;
      }

      const priceId =
        billingInterval === "annual" && tier.priceIdAnnual
          ? tier.priceIdAnnual
          : tier.priceIdMonthly;

      if (!priceId) {
        toast({
          title: "Not available",
          description: `${tier.name} plan is not available with ${billingInterval} billing.`,
          variant: "destructive",
        });
        return;
      }

      setLoadingPriceId(priceId);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error(err.error ?? "Failed to start checkout");
        }
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (err) {
        toast({
          title: "Checkout failed",
          description:
            err instanceof Error ? err.message : "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoadingPriceId(null);
      }
    },
    [billingInterval, toast]
  );

  const getAnnualSavings = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return null;
    return `Save $${monthlyPrice * 2}/year`;
  };

  return (
    <div className="py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every plan pays for itself many times over. The average customer
            saves $500–$2,000/year. Start with a 30-day free trial — no credit
            card required.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border bg-muted/50 px-4 py-2">
            <span
              className={`text-sm font-medium transition-colors ${
                billingInterval === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={billingInterval === "annual"}
              onCheckedChange={(checked) =>
                setBillingInterval(checked ? "annual" : "monthly")
              }
            />
            <span
              className={`text-sm font-medium transition-colors ${
                billingInterval === "annual"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Annual
            </span>
            {billingInterval === "annual" && (
              <Badge
                variant="outline"
                className="ml-1 border-emerald-200 bg-emerald-50 text-emerald-700 text-xs dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                2 months free
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto mb-20">
          {tiers.map((tier) => {
            const price = formatPrice(tier.monthlyPrice, billingInterval);
            const isPaid = tier.monthlyPrice > 0;
            const isLoading =
              loadingPriceId === tier.priceIdMonthly ||
              loadingPriceId === tier.priceIdAnnual;

            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  tier.featured
                    ? "border-emerald-300 shadow-lg shadow-emerald-100/50 dark:border-emerald-700 dark:shadow-emerald-900/30 scale-[1.02] lg:scale-[1.04]"
                    : "shadow-sm"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className="mb-3">{tier.icon}</div>

                <h3 className="text-lg font-semibold mb-1">{tier.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{price}</span>
                  {isPaid && (
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  )}
                  {!isPaid && (
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      forever
                    </span>
                  )}
                </div>

                {billingInterval === "annual" && isPaid && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                    {getAnnualSavings(tier.monthlyPrice)}
                  </p>
                )}
                {billingInterval === "annual" && isPaid && (
                  <p className="text-xs text-muted-foreground mb-2">
                    ${(tier.monthlyPrice * 10).toFixed(0)} billed annually
                  </p>
                )}

                <p className="text-sm text-muted-foreground mb-5">
                  {tier.description}
                </p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isLoading}
                  className={`w-full ${
                    tier.featured
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : ""
                  }`}
                  variant={tier.featured ? "default" : tier.isFree ? "outline" : "outline"}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : tier.isFree ? (
                    "Start Free Trial"
                  ) : (
                    tier.cta
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Feature comparison grid */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Compare plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground w-1/3">
                    Feature
                  </th>
                  <th className="text-center py-3 px-3 font-medium">Free</th>
                  <th className="text-center py-3 px-3 font-medium bg-emerald-50/50 dark:bg-emerald-950/10 rounded-t-lg">
                    Consumer
                  </th>
                  <th className="text-center py-3 px-3 font-medium">Family</th>
                  <th className="text-center py-3 px-3 font-medium">
                    Concierge
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`border-b ${
                      idx % 2 === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-3 px-4">{row.label}</td>
                    <td className="text-center py-3 px-3">
                      {row.free ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-3 bg-emerald-50/50 dark:bg-emerald-950/10">
                      {row.consumer ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-3">
                      {row.family ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-3">
                      {row.concierge ? (
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ / CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground text-sm mb-4">
            Questions?{" "}
            <Link
              href="/support"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Contact our team
            </Link>{" "}
            — we&apos;re happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}
