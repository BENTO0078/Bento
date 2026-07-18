"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Building2,
  CreditCard,
  Receipt,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Search,
  CheckCircle2,
} from "lucide-react";

interface Finding {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  category: string;
  delay: number;
}

const SCAN_STEPS = [
  { message: "Scanning bank statements...", icon: Building2, duration: 1000 },
  {
    message: "Detecting recurring subscriptions...",
    icon: CreditCard,
    duration: 1200,
  },
  {
    message: "Analyzing bills for negotiation opportunities...",
    icon: Receipt,
    duration: 1400,
  },
  {
    message: "Checking for price drops and refunds...",
    icon: RotateCcw,
    duration: 1200,
  },
  {
    message: "Tracking warranty expirations...",
    icon: ShieldCheck,
    duration: 1000,
  },
  {
    message: "Calculating potential savings...",
    icon: TrendingUp,
    duration: 1500,
  },
];

const FINDINGS: Finding[] = [
  {
    id: "netflix",
    icon: <span className="text-lg font-bold text-red-500">N</span>,
    title: "Netflix",
    subtitle: "Inactive — last watched 4 months ago",
    amount: "$15.99/mo",
    category: "Entertainment",
    delay: 1500,
  },
  {
    id: "comcast",
    icon: <span className="text-lg font-bold text-blue-600">C</span>,
    title: "Comcast Internet",
    subtitle: "Negotiable — market rate $49/mo",
    amount: "$89/mo",
    category: "Utilities",
    delay: 2500,
  },
  {
    id: "planet-fitness",
    icon: <span className="text-lg font-bold text-purple-600">P</span>,
    title: "Planet Fitness",
    subtitle: "No check-ins in 6 months",
    amount: "$10/mo",
    category: "Fitness",
    delay: 3200,
  },
  {
    id: "amazon",
    icon: <span className="text-lg font-bold text-amber-500">A</span>,
    title: "Amazon",
    subtitle: "3 price drops on recent purchases",
    amount: "$37.24 refund",
    category: "Shopping",
    delay: 4000,
  },
  {
    id: "audible",
    icon: <span className="text-lg font-bold text-orange-500">A</span>,
    title: "Audible",
    subtitle: "0 credits used in 3 months",
    amount: "$14.95/mo",
    category: "Entertainment",
    delay: 4800,
  },
  {
    id: "geico",
    icon: <span className="text-lg font-bold text-green-600">G</span>,
    title: "GEICO Auto",
    subtitle: "Competitor rates $112/mo",
    amount: "$156/mo",
    category: "Insurance",
    delay: 5600,
  },
  {
    id: "applecare",
    icon: <span className="text-lg font-bold text-gray-700 dark:text-gray-300">A</span>,
    title: "AppleCare+",
    subtitle: "Warranty expiring in 15 days",
    amount: "iPhone coverage",
    category: "Warranty",
    delay: 6400,
  },
];

interface StepScanningProps {
  onComplete: () => void;
}

export function StepScanning({ onComplete }: StepScanningProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleFindings, setVisibleFindings] = useState<Finding[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const findingsContainerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const totalDuration = SCAN_STEPS.reduce((acc, s) => acc + s.duration, 0) + 1000;

  const advanceProgress = useCallback(() => {
    setProgress((prev) => {
      if (prev >= 100) return prev;
      return Math.min(prev + 1, 100);
    });
  }, []);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Progress bar animation
    const progressInterval = totalDuration / 100;
    const progressTimer = setInterval(advanceProgress, progressInterval);

    // Scan steps animation
    let stepIndex = 0;
    const runSteps = () => {
      if (stepIndex >= SCAN_STEPS.length) return;
      const step = SCAN_STEPS[stepIndex];
      setCurrentStep(stepIndex);
      const timer = setTimeout(() => {
        stepIndex++;
        runSteps();
      }, step.duration);
      return () => clearTimeout(timer);
    };
    runSteps();

    // Show findings at their delay times
    FINDINGS.forEach((finding) => {
      const timer = setTimeout(() => {
        setVisibleFindings((prev) => [...prev, finding]);
      }, finding.delay);
      return () => clearTimeout(timer);
    });

    // Complete scan
    const completeTimer = setTimeout(() => {
      setScanComplete(true);
      // Small delay to show completion before transitioning
      setTimeout(() => {
        onComplete();
      }, 1200);
    }, totalDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [advanceProgress, onComplete, totalDuration]);

  const currentScanStep = SCAN_STEPS[currentStep];
  const CurrentIcon = currentScanStep?.icon || Search;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <CurrentIcon className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {scanComplete ? "Scan Complete!" : "Scanning Your Finances"}
          </h2>
          <p className="text-muted-foreground">
            {scanComplete
              ? "We found significant savings opportunities."
              : currentScanStep?.message}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right tabular-nums">
            {progress}%
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {SCAN_STEPS.map((step, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300",
                i < currentStep
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  : i === currentStep
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 animate-pulse"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < currentStep ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    i === currentStep ? "bg-emerald-500" : "bg-muted-foreground/40"
                  )}
                />
              )}
              {step.message.length > 30
                ? step.message.slice(0, 28) + "..."
                : step.message}
            </div>
          ))}
        </div>

        {/* Live findings feed */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1" ref={findingsContainerRef}>
          {visibleFindings.map((finding) => (
            <Card
              key={finding.id}
              className="animate-slide-in-from-left overflow-hidden"
            >
              <div className="p-4 flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    finding.category === "Entertainment"
                      ? "bg-red-100 dark:bg-red-900/20"
                      : finding.category === "Utilities"
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : finding.category === "Fitness"
                      ? "bg-purple-100 dark:bg-purple-900/20"
                      : finding.category === "Shopping"
                      ? "bg-amber-100 dark:bg-amber-900/20"
                      : finding.category === "Insurance"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  {finding.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm truncate">
                      {finding.title}
                    </p>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {finding.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {finding.subtitle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {finding.amount}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {scanComplete && (
          <div className="text-center space-y-2 animate-zoom-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <DollarSign className="h-4 w-4" />
              $847 in potential savings found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
