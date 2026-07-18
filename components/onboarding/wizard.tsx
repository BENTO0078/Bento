"use client";

import { useState, useCallback, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { StepWelcome } from "./step-welcome";
import { StepScanning } from "./step-scanning";
import { StepResults } from "./step-results";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  { id: 1, label: "Connect" },
  { id: 2, label: "Scan" },
  { id: 3, label: "Results" },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if onboarding already completed
  useEffect(() => {
    const checkOnboarding = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();
        if (profile?.onboarding_completed) {
          router.replace("/dashboard");
          return;
        }
      }
      setMounted(true);
    };
    checkOnboarding();
  }, [supabase, router]);

  const handleStartScan = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const handleScanComplete = useCallback(() => {
    setCurrentStep(3);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm animate-pulse">
            B
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Progress Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                      currentStep > step.id
                        ? "bg-emerald-600 text-white"
                        : currentStep === step.id
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-200 dark:ring-emerald-900"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden sm:block text-sm font-medium transition-colors",
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block w-16 md:w-24 mx-3 h-0.5 rounded transition-colors",
                      currentStep > step.id
                        ? "bg-emerald-600"
                        : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        {currentStep === 1 && <StepWelcome onStart={handleStartScan} />}
        {currentStep === 2 && <StepScanning onComplete={handleScanComplete} />}
        {currentStep === 3 && (
          <StepResults />
        )}
      </div>
    </div>
  );
}
