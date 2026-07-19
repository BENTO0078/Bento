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
  Shield,
  Phone,
  Wifi,
  Tv,
  HelpCircle,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

type Provider =
  | "Comcast/Xfinity"
  | "Spectrum"
  | "AT&T"
  | "Verizon"
  | "T-Mobile"
  | "Cox"
  | "Optimum"
  | "CenturyLink"
  | "Dish"
  | "DirecTV"
  | "State Farm"
  | "Geico"
  | "Progressive"
  | "Other";

type BillType = "Internet" | "Cable TV" | "Mobile Phone" | "Insurance" | "Other";

type Situation =
  | "Price went up recently"
  | "Found a better deal elsewhere"
  | "Been a loyal customer for years"
  | "Just want to pay less"
  | "Poor service experience";

type Step = 1 | 2 | 3;

interface Selections {
  provider: Provider | "";
  billType: BillType | "";
  situation: Situation | "";
}

/* ────────────────────────────────────────────
   Providers list
   ──────────────────────────────────────────── */

const providers: Provider[] = [
  "Comcast/Xfinity",
  "Spectrum",
  "AT&T",
  "Verizon",
  "T-Mobile",
  "Cox",
  "Optimum",
  "CenturyLink",
  "Dish",
  "DirecTV",
  "State Farm",
  "Geico",
  "Progressive",
  "Other",
];

const billTypes: BillType[] = [
  "Internet",
  "Cable TV",
  "Mobile Phone",
  "Insurance",
  "Other",
];

const situations: Situation[] = [
  "Price went up recently",
  "Found a better deal elsewhere",
  "Been a loyal customer for years",
  "Just want to pay less",
  "Poor service experience",
];

/* ────────────────────────────────────────────
   Icons per bill type
   ──────────────────────────────────────────── */

const billTypeIcons: Record<BillType, React.ReactNode> = {
  Internet: <Wifi className="h-5 w-5" />,
  "Cable TV": <Tv className="h-5 w-5" />,
  "Mobile Phone": <Phone className="h-5 w-5" />,
  Insurance: <Shield className="h-5 w-5" />,
  Other: <HelpCircle className="h-5 w-5" />,
};

/* ────────────────────────────────────────────
   Script generator — all combinations
   ──────────────────────────────────────────── */

interface ScriptResult {
  opening: string;
  phrases: string[];
  successRate: string;
  savingsEstimate: string;
}

function generateScript(
  provider: Provider | "",
  billType: BillType | "",
  situation: Situation | ""
): ScriptResult {
  const prov = provider || "your provider";
  const isISP = [
    "Comcast/Xfinity",
    "Spectrum",
    "Cox",
    "Optimum",
    "CenturyLink",
  ].includes(provider as string);
  const isWireless = ["AT&T", "Verizon", "T-Mobile"].includes(
    provider as string
  );
  const isTV = ["Dish", "DirecTV"].includes(provider as string);
  const isInsurance = ["State Farm", "Geico", "Progressive"].includes(
    provider as string
  );
  // Build opening line
  let opening = "";
  if (billType === "Internet") {
    opening = `Hi, I'm calling about my internet plan with ${prov}. `;
  } else if (billType === "Cable TV") {
    opening = `Hi, I'd like to review my TV package with ${prov}. `;
  } else if (billType === "Mobile Phone") {
    opening = `Hi, I'm calling to discuss my mobile plan with ${prov}. `;
  } else if (billType === "Insurance") {
    opening = `Hi, I'm reviewing my ${prov} insurance policy and wanted to discuss my rate. `;
  } else {
    opening = `Hi, I'm calling about my ${prov} bill and wanted to review my account. `;
  }

  // Situation-specific openers
  if (situation === "Price went up recently") {
    opening += `I noticed my bill went up recently and I'd like to understand why — and see if we can get it back down to what I was paying before.`;
  } else if (situation === "Found a better deal elsewhere") {
    opening += `I've been shopping around and found a comparable plan at a significantly lower price. Before I make the switch, I wanted to give ${prov} a chance to keep my business.`;
  } else if (situation === "Been a loyal customer for years") {
    opening += `I've been with ${prov} for quite a while now and I've always paid on time. I'm hoping there's a loyalty discount or promotion you can offer to reward that.`;
  } else if (situation === "Just want to pay less") {
    opening += `I'm reviewing my monthly expenses and this bill is higher than I'd like. I'd love to find ways to bring it down — are there any promotions or lower-tier plans available?`;
  } else if (situation === "Poor service experience") {
    opening += `I've had some frustrating experiences with my service recently and I'm reconsidering whether I'm getting good value. I'd like to talk about what you can do to make this right.`;
  }

  // Build phrases
  const phrases: string[] = [];

  // Provider-specific phrases
  if (isISP) {
    if (situation === "Found a better deal elsewhere") {
      phrases.push(
        `"I'm looking at an offer from ${prov === "Comcast/Xfinity" ? "AT&T Fiber" : prov === "Spectrum" ? "T-Mobile 5G Home Internet" : "a competitor"} that's about $20-30 less per month for similar speeds. Can you match or beat that?"`
      );
    } else if (situation === "Price went up recently") {
      phrases.push(
        `"I see my bill went up by about [amount]. Was this a promotional rate expiring? Can we reinstate the previous rate or find a new promo?"`
      );
    } else if (situation === "Poor service experience") {
      phrases.push(
        `"I've had [number] outages this month alone. I'm paying for reliable service and not getting it. What compensation or discount can you offer for the downtime?"`
      );
    } else {
      phrases.push(
        `"I see competitors advertising plans at [lower price]. What can you offer to make staying with ${prov} more competitive?"`
      );
    }
    phrases.push(
      `"Can you check if there are any unadvertised retention offers or loyalty discounts on my account? I'd rather stay with ${prov} if we can find a fair price."`
    );
    phrases.push(
      `"Are there any bundle adjustments, autopay discounts, or paperless billing credits I'm not taking advantage of right now?"`
    );
  } else if (isWireless) {
    if (situation === "Found a better deal elsewhere") {
      phrases.push(
        `"I've been comparing plans and ${prov === "AT&T" ? "T-Mobile" : prov === "Verizon" ? "T-Mobile" : "Verizon"} is offering a very similar plan for [$X] less per month. Is there any way you can get closer to that?"`
      );
    } else {
      phrases.push(
        `"I noticed there are newer plans available that might fit my usage better. Can you review my data usage and recommend the most cost-effective plan?"`
      );
    }
    phrases.push(
      `"Are there any loyalty or tenure-based discounts I qualify for? I've been a customer for [X years] and would love to see that recognized."`
    );
    if (situation !== "Just want to pay less") {
      phrases.push(
        `"I've heard other carriers are offering trade-in deals and switching credits right now — what can ${prov} do to make staying compelling?"`
      );
    } else {
      phrases.push(
        `"Can we look at whether I'm on the right plan for my actual usage? I think I might be paying for data I don't use."`
      );
    }
  } else if (isTV) {
    phrases.push(
      `"I'm not watching half the channels in my current package. Can we downgrade me to a more affordable tier without losing [must-have channel]?"`
    );
    phrases.push(
      `"With streaming services becoming so popular, I'm honestly considering cutting the cord. What's your best retention offer to keep me as a TV customer?"`
    );
    phrases.push(
      `"I see you're running promotions for new customers at [lower price]. As an existing customer, what can you offer me that's comparable?"`
    );
  } else if (isInsurance) {
    if (situation === "Found a better deal elsewhere") {
      phrases.push(
        `"I've received a quote from ${prov === "State Farm" ? "Geico" : prov === "Geico" ? "Progressive" : "State Farm"} that's about [$X] less per 6 months for the same coverage. Can you review my policy for any savings?"`
      );
    } else {
      phrases.push(
        `"I'd like someone to review my policy. I think there may be discounts I'm missing — multi-policy, safe driver, low mileage, or paid-in-full discounts."`
      );
    }
    phrases.push(
      `"Has my driving record or claim history improved enough to qualify for a better rate? I haven't had any claims in [X years]."`
    );
    phrases.push(
      `"Can we re-run my credit-based insurance score? It's been a while since my policy was first underwritten and my credit has improved."`
    );
    if (situation === "Been a loyal customer for years") {
      phrases.push(
        `"I've been with ${prov} for a long time without any claims. I'd really appreciate having my loyalty recognized in my premium."`
      );
    } else {
      phrases.push(
        `"Are there any bundling opportunities I'm missing? I'd consider moving my [auto/home/renters] to ${prov} if there's a meaningful discount."`
      );
    }
  } else {
    // Other / generic
    phrases.push(
      `"I'm reviewing all my monthly expenses and this bill stands out. What options do you have for lowering it?"`
    );
    phrases.push(
      `"Are there any promotions, discounts, or plan adjustments available that I might not be aware of?"`
    );
    if (situation === "Found a better deal elsewhere") {
      phrases.push(
        `"I've found a comparable service at a lower price. I'd prefer to stay, but I need the numbers to work. Can you help?"`
      );
    } else if (situation === "Been a loyal customer for years") {
      phrases.push(
        `"I've been a customer for years and always pay on time. I'm hoping there's something you can do to show appreciation for that loyalty."`
      );
    } else {
      phrases.push(
        `"What's the best rate you can offer a long-standing customer who wants to keep their business here?"`
      );
    }
  }

  // Add a closing phrase for all
  if (situation === "Found a better deal elsewhere") {
    phrases.push(
      `"I'd really prefer not to switch — I like ${prov}'s service. But I need to be practical about my budget. What can you do to make this work?"`
    );
  } else if (situation === "Poor service experience") {
    phrases.push(
      `"I'm willing to give ${prov} another chance if you can make this right. What can you offer to restore my confidence?"`
    );
  } else {
    phrases.push(
      `"I appreciate you taking the time to look into this. Even a small reduction makes a difference, so anything you can do helps."`
    );
  }

  // Success rate & savings estimate
  let successRate = "";
  let savingsEstimate = "";

  if (isISP) {
    successRate = "78%";
    savingsEstimate = "$15–40/month";
  } else if (isWireless) {
    successRate = "72%";
    savingsEstimate = "$10–35/month";
  } else if (isTV) {
    successRate = "65%";
    savingsEstimate = "$20–50/month";
  } else if (isInsurance) {
    successRate = "74%";
    savingsEstimate = "$25–60/month";
  } else {
    successRate = "68%";
    savingsEstimate = "$10–40/month";
  }

  return { opening, phrases, successRate, savingsEstimate };
}

/* ────────────────────────────────────────────
   Twitter SVG icon (since lucide-react v0.x doesn't export it)
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

export default function BillNegotiatorPage() {
  const [step, setStep] = useState<Step>(1);
  const [selections, setSelections] = useState<Selections>({
    provider: "",
    billType: "",
    situation: "",
  });
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const script = useMemo(() => {
    if (
      !selections.provider ||
      !selections.billType ||
      !selections.situation
    ) {
      return null;
    }
    return generateScript(
      selections.provider,
      selections.billType,
      selections.situation
    );
  }, [selections]);

  const fullScriptText = useMemo(() => {
    if (!script) return "";
    const parts = [script.opening, "", ...script.phrases.map((p) => `• ${p}`)];
    // Add tip at the end
    parts.push(
      "",
      "💡 Tip: Stay calm and polite. If they say no, politely ask to speak with the retention department — they have more authority to offer discounts."
    );
    return parts.join("\n");
  }, [script]);

  const canProceedStep1 = selections.provider !== "";
  const canProceedStep2 = selections.billType !== "";
  const canProceedStep3 = selections.situation !== "";

  const handleGenerate = useCallback(() => {
    setShowResult(true);
  }, []);

  const handleCopyScript = useCallback(async () => {
    if (!fullScriptText) return;
    try {
      await navigator.clipboard.writeText(fullScriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = fullScriptText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullScriptText]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/tools/bill-negotiator`;
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
    setSelections({ provider: "", billType: "", situation: "" });
    setShowResult(false);
    setCopied(false);
  }, []);

  const shareTweetUrl = useMemo(() => {
    const url = encodeURIComponent(
      "https://bento.app/tools/bill-negotiator"
    );
    const savingsEst = script?.savingsEstimate || "$15-40/month";
    const text = encodeURIComponent(
      `Just generated a free bill negotiation script and I'm about to save ${savingsEst}. Try it:`
    );
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  }, [script]);

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
              Free Bill Negotiation
              <br />
              <span className="text-primary">Script Generator</span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl mb-2">
              Generate a personalized negotiation script in 30 seconds.
            </p>
            <p className="text-sm text-muted-foreground">
              Works for Comcast, AT&amp;T, Verizon, Spectrum, State Farm,
              Geico &amp; more. Copy, paste, and save money.
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
                    ? "Build Your Script"
                    : "Your Personalized Script"}
                </CardTitle>
                {!showResult && (
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {step} of 3
                  </span>
                )}
              </div>
              {!showResult && (
                <div className="flex gap-1.5">
                  {([1, 2, 3] as Step[]).map((s) => (
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
                  {/* ── Step 1: Provider ── */}
                  {step === 1 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        Who&apos;s your provider?
                      </label>
                      <Select
                        value={selections.provider || undefined}
                        onValueChange={(v) =>
                          setSelections((s) => ({
                            ...s,
                            provider: v as Provider,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full h-12 text-base">
                          <SelectValue placeholder="Select your provider..." />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selections.provider && (
                        <p className="text-xs text-muted-foreground mt-2 animate-fade-in">
                          ✓ {selections.provider} selected
                        </p>
                      )}
                    </div>
                  )}

                  {/* ── Step 2: Bill Type ── */}
                  {step === 2 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        What type of bill?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {billTypes.map((bt) => (
                          <button
                            key={bt}
                            type="button"
                            onClick={() =>
                              setSelections((s) => ({ ...s, billType: bt }))
                            }
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                              selections.billType === bt
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            }`}
                          >
                            <span
                              className={
                                selections.billType === bt
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }
                            >
                              {billTypeIcons[bt]}
                            </span>
                            <span className="text-sm font-medium">{bt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Step 3: Situation ── */}
                  {step === 3 && (
                    <div className="animate-fade-in">
                      <label className="text-sm font-semibold mb-3 block">
                        What&apos;s your situation?
                      </label>
                      <div className="space-y-2">
                        {situations.map((sit) => (
                          <button
                            key={sit}
                            type="button"
                            onClick={() =>
                              setSelections((s) => ({
                                ...s,
                                situation: sit,
                              }))
                            }
                            className={`w-full text-left flex items-center gap-3 rounded-xl border-2 p-4 transition-all duration-200 ${
                              selections.situation === sit
                                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                                : "border-border hover:border-muted-foreground/30 hover:bg-muted/50"
                            }`}
                          >
                            <span
                              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selections.situation === sit
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {selections.situation === sit && (
                                <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                              )}
                            </span>
                            <span className="text-sm font-medium">{sit}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Result ── */
                <div className="space-y-5 animate-zoom-in">
                  {script && (
                    <>
                      {/* Opening line */}
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Opening Line
                        </div>
                        <div className="rounded-lg bg-muted/50 border p-4 text-sm leading-relaxed">
                          {script.opening}
                        </div>
                      </div>

                      {/* Key phrases */}
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                          Key Phrases
                        </div>
                        <ul className="space-y-2">
                          {script.phrases.map((phrase, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm leading-relaxed"
                            >
                              <span className="text-primary font-bold flex-shrink-0 mt-0.5">
                                {i + 1}.
                              </span>
                              <span className="rounded-md bg-muted/40 px-2 py-1 border border-border/50">
                                {phrase}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Success rate estimate */}
                      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                            Estimated Success Rate: {script.successRate}
                          </span>
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          People using this script save{" "}
                          <strong>{script.savingsEstimate}</strong> on average.
                        </p>
                      </div>

                      {/* Pro tip */}
                      <div className="text-xs text-muted-foreground italic bg-muted/30 rounded-lg p-3">
                        💡 This works best when you&apos;re calm, polite, and
                        prepared to mention competitor pricing. If the first
                        representative can&apos;t help, politely ask for the
                        retention department — they have more authority to
                        offer discounts.
                      </div>
                    </>
                  )}

                  {/* Copy + Share buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      onClick={handleCopyScript}
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
                          Copy Script
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
                {step < 3 ? (
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
                    disabled={!canProceedStep3}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Script
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>

          {/* ── Share buttons (below card, shown on result) ── */}
          {showResult && (
            <div className="mt-6 flex items-center justify-center gap-3">
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
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Want Bento to do this automatically?
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                We&apos;ll negotiate ALL your bills, cancel forgotten
                subscriptions, file refunds, and track warranties —{" "}
                <strong>automatically</strong>.
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
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick Your Provider",
                desc: "Choose from 14 major providers including Comcast, AT&T, Verizon, State Farm, and more.",
                icon: <MessageSquare className="h-6 w-6" />,
              },
              {
                step: "2",
                title: "Tell Us Your Situation",
                desc: "Select your bill type and situation — price hike, competitor offer, loyal customer, or poor service.",
                icon: <Sparkles className="h-6 w-6" />,
              },
              {
                step: "3",
                title: "Get Your Script",
                desc: "Copy your personalized negotiation script and use it on your next call to save money.",
                icon: <Copy className="h-6 w-6" />,
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
            Ready to automate your savings?
          </h2>
          <p className="text-base text-primary-foreground/80 mb-8">
            Bento negotiates bills, cancels forgotten subscriptions, files
            refunds, and tracks warranties — all automatically. One payment,
            lifetime access.
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
