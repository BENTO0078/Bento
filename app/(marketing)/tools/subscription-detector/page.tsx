"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Copy,
  Check,
  Share2,
  Sparkles,
  ArrowRight,
  Zap,
  Search,
  ShieldAlert,
  RotateCcw,
  TrendingDown,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

type StreamingCount = "0" | "1-2" | "3-5" | "6+" | "not-sure";
type LastCheck = "this-month" | "3-months" | "6-plus-months" | "never";
type TrialCount = "none" | "1-3" | "4-7" | "8-plus" | "dont-remember";
type Step = 1 | 2 | 3 | 4;

const SERVICES = [
  "Amazon Prime",
  "Walmart+",
  "DoorDash",
  "Uber One",
  "YouTube Premium",
  "Spotify",
  "Apple iCloud+",
  "Adobe CC",
  "Microsoft 365",
  "Gym membership",
  "Meal kits",
  "Audible",
] as const;

type Service = (typeof SERVICES)[number];

interface Selections {
  streaming: StreamingCount | "";
  lastCheck: LastCheck | "";
  services: Service[];
  trials: TrialCount | "";
}

/* ────────────────────────────────────────────
   Streaming options
   ──────────────────────────────────────────── */

const streamingOptions: { value: StreamingCount; label: string }[] = [
  { value: "0", label: "0 — I don't stream" },
  { value: "1-2", label: "1–2 services" },
  { value: "3-5", label: "3–5 services" },
  { value: "6+", label: "6 or more" },
  { value: "not-sure", label: "I'm not sure" },
];

const lastCheckOptions: { value: LastCheck; label: string }[] = [
  { value: "this-month", label: "This month" },
  { value: "3-months", label: "About 3 months ago" },
  { value: "6-plus-months", label: "6+ months ago" },
  { value: "never", label: "Never — I just let them run" },
];

const trialOptions: { value: TrialCount; label: string }[] = [
  { value: "none", label: "None — I avoid free trials" },
  { value: "1-3", label: "1–3 trials" },
  { value: "4-7", label: "4–7 trials" },
  { value: "8-plus", label: "8 or more" },
  { value: "dont-remember", label: "I don't remember" },
];

/* ────────────────────────────────────────────
   Results calculator
   ──────────────────────────────────────────── */

interface Result {
  low: number;
  high: number;
  riskLevel: "Low" | "Medium" | "High";
  riskExplanation: string;
  checklist: string[];
}

const serviceCosts: Record<Service, [number, number]> = {
  "Amazon Prime": [8, 15],
  "Walmart+": [7, 13],
  DoorDash: [5, 10],
  "Uber One": [5, 10],
  "YouTube Premium": [8, 14],
  Spotify: [6, 12],
  "Apple iCloud+": [3, 10],
  "Adobe CC": [20, 55],
  "Microsoft 365": [5, 10],
  "Gym membership": [15, 50],
  "Meal kits": [30, 80],
  Audible: [5, 15],
};

function calculateResult(selections: Selections): Result {
  // Base streaming waste
  const streamingBase: [number, number] = (() => {
    switch (selections.streaming) {
      case "0":
        return [0, 0];
      case "1-2":
        return [10, 25];
      case "3-5":
        return [35, 75];
      case "6+":
        return [80, 150];
      case "not-sure":
        return [40, 100];
      default:
        return [0, 0];
    }
  })();

  // Last check multiplier
  const multiplier: number = (() => {
    switch (selections.lastCheck) {
      case "this-month":
        return 0.7;
      case "3-months":
        return 1.0;
      case "6-plus-months":
        return 1.4;
      case "never":
        return 1.8;
      default:
        return 1.0;
    }
  })();

  // Services waste (per service that's NOT "None" — but we use checkboxes so only checked ones count)
  let servicesLow = 0;
  let servicesHigh = 0;
  for (const svc of selections.services) {
    const [l, h] = serviceCosts[svc];
    servicesLow += l;
    servicesHigh += h;
  }

  // Trial waste
  const trialCost: [number, number] = (() => {
    switch (selections.trials) {
      case "none":
        return [0, 0];
      case "1-3":
        return [5, 15];
      case "4-7":
        return [20, 50];
      case "8-plus":
        return [60, 120];
      case "dont-remember":
        return [30, 80];
      default:
        return [0, 0];
    }
  })();

  const low = Math.round(
    streamingBase[0] * multiplier + servicesLow + trialCost[0]
  );
  const high = Math.round(
    streamingBase[1] * multiplier + servicesHigh + trialCost[1]
  );

  // Risk level
  let riskLevel: "Low" | "Medium" | "High";
  let riskExplanation: string;
  const avg = (low + high) / 2;

  if (avg < 30) {
    riskLevel = "Low";
    riskExplanation =
      "You're in good shape! But even small leaks add up — a $15/month forgotten subscription is $180/year. A quick audit never hurts.";
  } else if (avg < 75) {
    riskLevel = "Medium";
    riskExplanation =
      "You're likely overpaying by a meaningful amount each month. This is hundreds of dollars a year that could be going toward savings, investments, or something you actually enjoy.";
  } else {
    riskLevel = "High";
    riskExplanation =
      "You're bleeding serious money on forgotten subscriptions and unused trials. At this rate, you could be burning $1,000+ per year without realizing it. It's time for an audit.";
  }

  // Checklist
  const checklist: string[] = [
    "Open your bank app and search for every recurring payment from the last 3 months.",
  ];

  if (selections.streaming === "6+" || selections.streaming === "not-sure") {
    checklist.push(
      "Check your streaming accounts — you might be paying for Netflix, Hulu, Disney+, HBO Max, Apple TV+ and more. Pick 2 and cancel the rest."
    );
  }
  if (selections.streaming === "3-5") {
    checklist.push(
      "Rotate your streaming services instead of keeping all of them active. Subscribe for one month, binge, cancel, then switch."
    );
  }

  if (selections.services.includes("Amazon Prime")) {
    checklist.push(
      "Review your Amazon Prime membership — if you only use it for shipping, consider sharing a Household account or cancelling between orders."
    );
  }
  if (selections.services.includes("DoorDash") || selections.services.includes("Uber One")) {
    checklist.push(
      "Delivery app subscriptions (DoorDash DashPass, Uber One) often auto-renew. Check if you're actually ordering enough to justify the monthly fee."
    );
  }
  if (selections.services.includes("Adobe CC")) {
    checklist.push(
      "Adobe Creative Cloud is one of the most expensive subscriptions out there. Check for free alternatives (Figma, DaVinci Resolve, GIMP) if you're not a power user."
    );
  }
  if (selections.services.includes("Gym membership")) {
    checklist.push(
      "Gym memberships are notorious money pits. Check your attendance — if you haven't gone in 3 months, cancel or freeze it."
    );
  }
  if (selections.services.includes("Meal kits")) {
    checklist.push(
      "Meal kit subscriptions can cost $60-120/week. Make sure you're not skipping weeks but forgetting to pause deliveries."
    );
  }
  if (selections.services.includes("Audible")) {
    checklist.push(
      "Audible credits expire if you cancel. Use any accumulated credits before you cancel, or pause your membership."
    );
  }

  if (selections.lastCheck === "never" || selections.lastCheck === "6-plus-months") {
    checklist.push(
      "Go through every line item on your last 3 bank statements. You'll almost certainly find at least one subscription you forgot about."
    );
  }

  if (selections.trials === "8-plus" || selections.trials === "dont-remember") {
    checklist.push(
      "Set a calendar reminder to cancel free trials the day before they convert. Better yet, use a virtual card that locks after the trial ends."
    );
  }
  if (selections.trials === "4-7") {
    checklist.push(
      "Review your email for 'trial ending soon' or 'welcome to your subscription' messages — these are the trials that converted without you noticing."
    );
  }

  checklist.push(
    "Check for annual subscriptions you forgot about — those $99/year charges are easy to miss month-to-month."
  );
  checklist.push(
    "Use Bento to find and cancel all of these automatically — it works while you sleep."
  );

  return {
    low,
    high,
    riskLevel,
    riskExplanation,
    checklist,
  };
}

/* ────────────────────────────────────────────
   Twitter SVG icon
   ──────────────────────────────────────────── */

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ────────────────────────────────────────────
   Main page component
   ──────────────────────────────────────────── */

export default function SubscriptionDetectorPage() {
  const [step, setStep] = useState<Step>(1);
  const [selections, setSelections] = useState<Selections>({
    streaming: "",
    lastCheck: "",
    services: [],
    trials: "",
  });
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    if (
      !selections.streaming ||
      !selections.lastCheck ||
      !selections.trials
    ) {
      return null;
    }
    return calculateResult(selections);
  }, [selections]);

  const canProceedStep1 = selections.streaming !== "";
  const canProceedStep2 = selections.lastCheck !== "";
  const canProceedStep4 = selections.trials !== "";

  const handleGenerate = useCallback(() => {
    setShowResult(true);
  }, []);

  const resultText = useMemo(() => {
    if (!result) return "";
    const lines = [
      `💰 Subscription Waste Estimate: $${result.low}–$${result.high}/month`,
      ``,
      `⚠️ Risk Level: ${result.riskLevel}`,
      `${result.riskExplanation}`,
      ``,
      `📋 Things to check:`,
      ...result.checklist.map((item, i) => `  ${i + 1}. ${item}`),
    ];
    return lines.join("\n");
  }, [result]);

  const handleCopyResults = useCallback(async () => {
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = resultText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [resultText]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/tools/subscription-detector`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, []);

  const handleReset = useCallback(() => {
    setStep(1);
    setSelections({ streaming: "", lastCheck: "", services: [], trials: "" });
    setShowResult(false);
    setCopied(false);
  }, []);

  const toggleService = useCallback((service: Service) => {
    setSelections((s) => {
      const exists = s.services.includes(service);
      return {
        ...s,
        services: exists
          ? s.services.filter((x) => x !== service)
          : [...s.services, service],
      };
    });
  }, []);

  const shareTweetUrl = useMemo(() => {
    const url = encodeURIComponent(
      "https://bento.app/tools/subscription-detector"
    );
    const waste = result
      ? `$${result.low}–$${result.high}`
      : "$30–80";
    const text = encodeURIComponent(
      `I might be wasting ${waste}/month on forgotten subscriptions. Check yours:`
    );
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }, [result]);

  const riskIcon = (level: string) => {
    switch (level) {
      case "Low":
        return <ThumbsUp className="h-5 w-5 text-emerald-500" />;
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "High":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const riskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800";
      case "Medium":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
      case "High":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      default:
        return "";
    }
  };

  const riskTextColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-emerald-800 dark:text-emerald-200";
      case "Medium":
        return "text-amber-800 dark:text-amber-200";
      case "High":
        return "text-red-800 dark:text-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ── */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-transparent to-transparent dark:from-emerald-950/15 pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative text-center">
          <div className="max-w-2xl mx-auto">
            <Badge
              variant="outline"
              className="mb-4 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Free Tool — No Account Needed
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-3">
              Find Your Forgotten
              <br />
              <span className="text-primary">Subscriptions</span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl mb-2">
              Answer 4 quick questions. Discover how much you&apos;re really wasting.
            </p>
            <p className="text-sm text-muted-foreground">
              The average person has 5+ subscriptions they forgot about.
              Find yours in 30 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tool Card ── */}
      <section className="pb-12">
        <div className="container max-w-2xl">
          <Card className="shadow-lg border-2 border-emerald-100 dark:border-emerald-900/40">
            {/* Progress indicator */}
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">
                  {!showResult
                    ? "Subscription Waste Quiz"
                    : "Your Results"}
                </CardTitle>
                {!showResult && (
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {step} of 4
                  </span>
                )}
              </div>
              {!showResult && (
                <div className="flex gap-1.5">
                  {([1, 2, 3, 4] as Step[]).map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        s < step
                          ? "bg-primary"
                          : s === step
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent>
              {!showResult ? (
                <div className="space-y-6">
                  {/* ── Step 1: Streaming ── */}
                  {step === 1 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        How many streaming services do you pay for?
                      </label>
                      <div className="space-y-2">
                        {streamingOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setSelections((s) => ({
                                ...s,
                                streaming: opt.value,
                              }))
                            }
                            className={`w-full text-left flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                              selections.streaming === opt.value
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            }`}
                          >
                            <span
                              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selections.streaming === opt.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selections.streaming === opt.value && (
                                <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                              )}
                            </span>
                            <span className="text-sm font-medium">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Step 2: Last Check ── */}
                  {step === 2 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        When did you last check all your subscriptions?
                      </label>
                      <div className="space-y-2">
                        {lastCheckOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setSelections((s) => ({
                                ...s,
                                lastCheck: opt.value,
                              }))
                            }
                            className={`w-full text-left flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                              selections.lastCheck === opt.value
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            }`}
                          >
                            <span
                              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selections.lastCheck === opt.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selections.lastCheck === opt.value && (
                                <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                              )}
                            </span>
                            <span className="text-sm font-medium">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Step 3: Services (Checkboxes) ── */}
                  {step === 3 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        Which of these do you use?{" "}
                        <span className="text-muted-foreground font-normal">
                          (select all that apply)
                        </span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SERVICES.map((service) => {
                          const checked = selections.services.includes(service);
                          return (
                            <label
                              key={service}
                              className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200 ${
                                checked
                                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                  : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                              }`}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleService(service)}
                                className="flex-shrink-0"
                              />
                              <span className="text-sm font-medium">{service}</span>
                            </label>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        {selections.services.length === 0
                          ? "No services selected — tap any you use."
                          : `${selections.services.length} service${selections.services.length > 1 ? "s" : ""} selected`}
                      </p>
                    </div>
                  )}

                  {/* ── Step 4: Free trials ── */}
                  {step === 4 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        How many free trials have you signed up for this year?
                      </label>
                      <div className="space-y-2">
                        {trialOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              setSelections((s) => ({
                                ...s,
                                trials: opt.value,
                              }))
                            }
                            className={`w-full text-left flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                              selections.trials === opt.value
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            }`}
                          >
                            <span
                              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selections.trials === opt.value
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selections.trials === opt.value && (
                                <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                              )}
                            </span>
                            <span className="text-sm font-medium">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Result ── */
                <div className="space-y-5 animate-zoom-in">
                  {result && (
                    <>
                      {/* Big number */}
                      <div className="text-center py-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Estimated Monthly Waste
                        </div>
                        <div className="text-5xl sm:text-6xl font-extrabold text-primary tracking-tight">
                          ${result.low}–${result.high}
                          <span className="text-2xl font-medium text-muted-foreground">
                            /mo
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          That&apos;s ${result.low * 12}–${result.high * 12}/year
                        </div>
                      </div>

                      {/* Risk level */}
                      <div
                        className={`rounded-lg border p-4 ${riskColor(result.riskLevel)}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {riskIcon(result.riskLevel)}
                          <span
                            className={`text-sm font-semibold ${riskTextColor(result.riskLevel)}`}
                          >
                            {result.riskLevel} Risk
                          </span>
                        </div>
                        <p
                          className={`text-sm ${riskTextColor(result.riskLevel)}`}
                        >
                          {result.riskExplanation}
                        </p>
                      </div>

                      {/* Checklist */}
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Things to Check Right Now
                        </div>
                        <ul className="space-y-2">
                          {result.checklist.map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-2.5 text-sm leading-relaxed"
                            >
                              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                                {i + 1}
                              </span>
                              <span className="pt-0.5">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Copy + Share buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleCopyResults}
                      className="flex-1 gap-2"
                      size="lg"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Results
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2"
                      onClick={handleReset}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start Over
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Navigation buttons (steps only) */}
            {!showResult && (
              <CardFooter className="flex justify-between pt-2">
                {step > 1 ? (
                  <Button
                    variant="ghost"
                    onClick={() => setStep((s) => (s - 1) as Step)}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < 4 ? (
                  <Button
                    onClick={() => setStep((s) => (s + 1) as Step)}
                    disabled={
                      (step === 1 && !canProceedStep1) ||
                      (step === 2 && !canProceedStep2)
                    }
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={!canProceedStep4}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="h-4 w-4" />
                    See My Results
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>

          {/* ── Share buttons (below card, shown on result) ── */}
          {showResult && (
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Share2 className="h-4 w-4" />
                Share this free tool:
              </span>
              <a
                href={shareTweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#1DA1F2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1a8cd8] transition-colors"
              >
                <TwitterIcon className="h-3.5 w-3.5" />
                X / Twitter
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-1.5 text-xs"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Bento CTA Card ── */}
      <section className="pb-16">
        <div className="container max-w-2xl">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Bento finds and cancels these automatically
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                We&apos;ll scan all your accounts, find every forgotten
                subscription, cancel the ones you don&apos;t want, and
                negotiate the ones you keep —{" "}
                <strong>automatically, forever</strong>.
              </p>
              <Link
                href="/lifetime"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Lifetime Access — $99
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-xs text-muted-foreground mt-4">
                30-day money-back guarantee &middot; Average user saves
                $847/year
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="pb-20 bg-muted/30 border-t">
        <div className="container max-w-2xl py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-10">
            How It Works
          </h2>
          <div className="grid gap-8 sm:grid-cols-4">
            {[
              {
                step: "1",
                title: "Streaming Check",
                desc: "Tell us how many streaming services you pay for — the average is 3–4.",
                icon: <TrendingDown className="h-6 w-6" />,
              },
              {
                step: "2",
                title: "Audit Habits",
                desc: "When did you last review your subscriptions? Most people say 'never.'",
                icon: <Search className="h-6 w-6" />,
              },
              {
                step: "3",
                title: "Spot the Leaks",
                desc: "Check off the services you use — we'll estimate what the forgotten ones cost.",
                icon: <AlertTriangle className="h-6 w-6" />,
              },
              {
                step: "4",
                title: "Get Your Number",
                desc: "See your estimated waste, risk level, and an action plan to fix it.",
                icon: <Zap className="h-6 w-6" />,
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-primary mb-1">
                    Step {item.step}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-primary">
        <div className="container text-center max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl mb-4">
            Stop wasting money on subscriptions you forgot about
          </h2>
          <p className="text-base text-primary-foreground/80 mb-8">
            Bento scans your accounts, finds forgotten subscriptions, cancels
            them automatically, and negotiates better rates on the ones you
            keep. One payment, lifetime access.
          </p>
          <Link
            href="/lifetime"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-4 text-base font-bold text-primary shadow-lg hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Lifetime Access — $99
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-primary-foreground/60 mt-4">
            ⚡ Flash sale price — 30-day money-back guarantee
          </p>
        </div>
      </section>
    </div>
  );
}
