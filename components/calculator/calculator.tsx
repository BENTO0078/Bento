"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Share2,
  Copy,
  Sparkles,
  TrendingUp,
} from "lucide-react";

/** Inline Twitter/X icon — not available in this version of lucide-react */
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Answers {
  streaming: string[];
  internetBill: number | null;
  monthlyPurchases: number | null;
  warrantyItems: number | null;
  subscriptionBoxes: string[];
}

interface CategoryEstimate {
  label: string;
  annualLoss: number;
  color: string;
}

const STEP_TITLES = [
  "Streaming Services",
  "Internet Bill",
  "Monthly Purchases",
  "Warranty Tracking",
  "Subscription Boxes",
];

const STEP_DESCRIPTIONS = [
  "How many streaming subscriptions do you pay for?",
  "How much is your monthly internet bill?",
  "How many online purchases do you make per month?",
  "How many high-value items (electronics, appliances) do you own?",
  "Which subscription boxes do you receive?",
];

const STREAMING_OPTIONS = [
  { id: "netflix", label: "Netflix", avgMonthly: 15.49 },
  { id: "disney", label: "Disney+", avgMonthly: 13.99 },
  { id: "hulu", label: "Hulu", avgMonthly: 9.99 },
  { id: "max", label: "Max (HBO)", avgMonthly: 16.99 },
  { id: "prime", label: "Amazon Prime", avgMonthly: 14.99 },
  { id: "apple", label: "Apple TV+", avgMonthly: 9.99 },
  { id: "spotify", label: "Spotify Premium", avgMonthly: 11.99 },
  { id: "youtube", label: "YouTube Premium", avgMonthly: 13.99 },
  { id: "paramount", label: "Paramount+", avgMonthly: 7.99 },
  { id: "peacock", label: "Peacock", avgMonthly: 7.99 },
];

const INTERNET_BILL_OPTIONS = [
  { value: 30, label: "~$30/month" },
  { value: 50, label: "~$50/month" },
  { value: 70, label: "~$70/month" },
  { value: 90, label: "~$90/month" },
  { value: 120, label: "~$120/month" },
  { value: 150, label: "$150+/month" },
];

const PURCHASE_OPTIONS = [
  { value: 5, label: "1–5/month" },
  { value: 15, label: "6–15/month" },
  { value: 30, label: "16–30/month" },
  { value: 50, label: "30+/month" },
];

const WARRANTY_OPTIONS = [
  { value: 2, label: "0–2 items" },
  { value: 5, label: "3–5 items" },
  { value: 10, label: "6–10 items" },
  { value: 20, label: "10+ items" },
];

const SUBSCRIPTION_BOX_OPTIONS = [
  { id: "meal-kit", label: "Meal Kit (HelloFresh, etc.)", avgMonthly: 65 },
  { id: "beauty", label: "Beauty Box (Ipsy, Birchbox)", avgMonthly: 15 },
  { id: "fashion", label: "Fashion (Stitch Fix, Nuuly)", avgMonthly: 60 },
  { id: "snacks", label: "Snack Box (SnackCrate)", avgMonthly: 25 },
  { id: "pet", label: "Pet Box (BarkBox)", avgMonthly: 30 },
  { id: "wine", label: "Wine Club", avgMonthly: 50 },
  { id: "coffee", label: "Coffee Subscription", avgMonthly: 22 },
  { id: "books", label: "Book Box", avgMonthly: 18 },
];

// ─── Calculation Logic ───────────────────────────────────────────────────────

function estimateSavings(answers: Answers): CategoryEstimate[] {
  const categories: CategoryEstimate[] = [];

  // 1. Streaming services — estimate 30% of what you pay is "waste" (forgotten subs, price hikes)
  const streamingTotal = answers.streaming.reduce((sum, id) => {
    const opt = STREAMING_OPTIONS.find((o) => o.id === id);
    return sum + (opt?.avgMonthly ?? 0);
  }, 0);
  categories.push({
    label: "Streaming",
    annualLoss: Math.round(streamingTotal * 0.3 * 12),
    color: "bg-red-500",
  });

  // 2. Internet bill — average negotiation saves ~$15–25/month
  if (answers.internetBill) {
    const potentialSavings =
      answers.internetBill >= 70
        ? 20
        : answers.internetBill >= 50
          ? 15
          : 10;
    categories.push({
      label: "Internet Bill",
      annualLoss: potentialSavings * 12,
      color: "bg-blue-500",
    });
  }

  // 3. Monthly purchases — refund opportunities for ~3% of purchases at ~$40 avg order
  if (answers.monthlyPurchases) {
    const annualRefundLoss = Math.round(
      answers.monthlyPurchases * 12 * 40 * 0.03
    );
    categories.push({
      label: "Unclaimed Refunds",
      annualLoss: annualRefundLoss,
      color: "bg-amber-500",
    });
  }

  // 4. Warranty items — missed warranty claims ~$50/year per item that should be covered
  if (answers.warrantyItems) {
    categories.push({
      label: "Missed Warranty Claims",
      annualLoss: answers.warrantyItems * 50,
      color: "bg-purple-500",
    });
  }

  // 5. Subscription boxes — estimate 50% of boxes go underused
  const boxTotal = answers.subscriptionBoxes.reduce((sum, id) => {
    const opt = SUBSCRIPTION_BOX_OPTIONS.find((o) => o.id === id);
    return sum + (opt?.avgMonthly ?? 0);
  }, 0);
  categories.push({
    label: "Underused Boxes",
    annualLoss: Math.round(boxTotal * 0.5 * 12),
    color: "bg-emerald-500",
  });

  return categories;
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  duration = 1200,
}: {
  target: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const steps = 40;
    const increment = target / steps;
    const interval = duration / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, target);
      setValue(Math.round(current));
      if (step >= steps) {
        clearInterval(timer);
        setValue(target);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{value.toLocaleString()}</>;
}

// ─── Share Buttons ───────────────────────────────────────────────────────────

function ShareButtons({ total }: { total: number }) {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(
    `I'm losing $${total.toLocaleString()}/year on forgotten subscriptions, overpriced bills, and unclaimed refunds. 😱\n\nBento found it in 30 seconds — check your number:`
  );
  const shareUrl = encodeURIComponent("https://getbento.ai/calculator");
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const redditUrl = `https://www.reddit.com/submit?url=${shareUrl}&title=${encodeURIComponent(`I'm losing $${total.toLocaleString()}/year — Bento calculator`)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `https://getbento.ai/calculator`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      setCopied(false);
    }
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a8cd8] transition-colors"
      >
        <TwitterIcon className="h-4 w-4" />
        Share on X
      </a>
      <a
        href={redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-[#FF4500] px-4 py-2 text-sm font-medium text-white hover:bg-[#e03e00] transition-colors"
      >
        <Share2 className="h-4 w-4" />
        Reddit
      </a>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    streaming: [],
    internetBill: null,
    monthlyPurchases: null,
    warrantyItems: null,
    subscriptionBoxes: [],
  });
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 5;

  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  }, [step]);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return answers.streaming.length > 0;
      case 1:
        return answers.internetBill !== null;
      case 2:
        return answers.monthlyPurchases !== null;
      case 3:
        return answers.warrantyItems !== null;
      case 4:
        return answers.subscriptionBoxes.length > 0;
      default:
        return false;
    }
  }, [step, answers]);

  const toggleStreaming = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      streaming: prev.streaming.includes(id)
        ? prev.streaming.filter((s) => s !== id)
        : [...prev.streaming, id],
    }));
  };

  const toggleSubscriptionBox = (id: string) => {
    setAnswers((prev) => ({
      ...prev,
      subscriptionBoxes: prev.subscriptionBoxes.includes(id)
        ? prev.subscriptionBoxes.filter((s) => s !== id)
        : [...prev.subscriptionBoxes, id],
    }));
  };

  const estimates = useMemo(() => estimateSavings(answers), [answers]);
  const totalAnnualLoss = useMemo(
    () => estimates.reduce((sum, e) => sum + e.annualLoss, 0),
    [estimates]
  );
  const maxCategory = useMemo(
    () => Math.max(...estimates.map((e) => e.annualLoss), 1),
    [estimates]
  );

  // Results view
  if (showResults) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Sparkle header */}
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Your Bento Analysis
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2 animate-fade-in">
            You&apos;re losing
          </h2>
          <div className="text-6xl sm:text-7xl font-black text-red-500 mb-6 animate-zoom-in">
            $
            <AnimatedCounter target={totalAnnualLoss} />
            <span className="text-2xl text-muted-foreground font-medium">
              /year
            </span>
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto animate-fade-in">
            That&apos;s money leaking from forgotten subscriptions, overpriced
            bills, missed refunds, and unused boxes. Bento finds and fixes all of
            this — automatically.
          </p>

          {/* Category breakdown */}
          <div className="space-y-4 mb-10 text-left animate-slide-in-from-left">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground text-center">
              Where your money goes
            </h3>
            {estimates
              .filter((e) => e.annualLoss > 0)
              .sort((a, b) => b.annualLoss - a.annualLoss)
              .map((cat) => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.label}</span>
                    <span className="text-sm font-semibold">
                      ${cat.annualLoss.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color} transition-all duration-1000 ease-out`}
                      style={{
                        width: `${Math.round((cat.annualLoss / maxCategory) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6 sm:p-8 mb-8 animate-zoom-in">
            <h3 className="text-xl font-bold mb-2">
              Bento saves this automatically
            </h3>
            <p className="text-muted-foreground mb-6">
              Plug in your accounts and Bento cancels, negotiates, and files
              refunds — all in the background. Average customer saves{" "}
              <strong>$500–$2,000/year</strong>.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-emerald-700 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              Start Saving Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-sm text-muted-foreground mt-3">
              Free scan · 30-day trial · No credit card
            </p>
          </div>

          {/* Share buttons */}
          <ShareButtons total={totalAnnualLoss} />

          {/* Retake */}
          <button
            onClick={() => {
              setShowResults(false);
              setStep(0);
              setAnswers({
                streaming: [],
                internetBill: null,
                monthlyPurchases: null,
                warrantyItems: null,
                subscriptionBoxes: [],
              });
            }}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz step
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="max-w-xl w-full mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-emerald-600">
              {Math.round(((step + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          {STEP_TITLES[step]}
        </h2>
        <p className="text-muted-foreground mb-8">{STEP_DESCRIPTIONS[step]}</p>

        {/* Step 0: Streaming */}
        {step === 0 && (
          <div className="space-y-3">
            {STREAMING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 ${
                  answers.streaming.includes(opt.id)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                    : ""
                }`}
              >
                <Checkbox
                  checked={answers.streaming.includes(opt.id)}
                  onCheckedChange={() => toggleStreaming(opt.id)}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                  <span className="font-medium text-sm">{opt.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ~${opt.avgMonthly}/mo
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Step 1: Internet Bill */}
        {step === 1 && (
          <div className="space-y-3">
            {INTERNET_BILL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, internetBill: opt.value }))
                }
                className={`w-full text-left rounded-lg border p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 ${
                  answers.internetBill === opt.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                    : ""
                }`}
              >
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Monthly Purchases */}
        {step === 2 && (
          <div className="space-y-3">
            {PURCHASE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    monthlyPurchases: opt.value,
                  }))
                }
                className={`w-full text-left rounded-lg border p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 ${
                  answers.monthlyPurchases === opt.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                    : ""
                }`}
              >
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Warranty Items */}
        {step === 3 && (
          <div className="space-y-3">
            {WARRANTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    warrantyItems: opt.value,
                  }))
                }
                className={`w-full text-left rounded-lg border p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 ${
                  answers.warrantyItems === opt.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                    : ""
                }`}
              >
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Subscription Boxes */}
        {step === 4 && (
          <div className="space-y-3">
            {SUBSCRIPTION_BOX_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 ${
                  answers.subscriptionBoxes.includes(opt.id)
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 ring-1 ring-emerald-500"
                    : ""
                }`}
              >
                <Checkbox
                  checked={answers.subscriptionBoxes.includes(opt.id)}
                  onCheckedChange={() => toggleSubscriptionBox(opt.id)}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                  <span className="font-medium text-sm">{opt.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ~${opt.avgMonthly}/mo
                </span>
              </label>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
          >
            {step === totalSteps - 1 ? (
              <>
                <TrendingUp className="h-4 w-4" />
                See My Results
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
