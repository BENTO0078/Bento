"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  PiggyBank,
  Gift,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "bento-referral-code";

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refCode = searchParams.get("ref");
  const [stored, setStored] = useState(false);

  useEffect(() => {
    if (refCode && refCode.trim().length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, refCode.trim().toUpperCase());
        setStored(true);
      } catch {
        // localStorage may be unavailable
        setStored(false);
      }
    }
  }, [refCode]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <Card className="max-w-lg w-full border-2 border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40">
              <Gift className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {refCode
              ? "Your friend found $847 in hidden savings. You can too."
              : "Start saving with Bento"}
          </CardTitle>
          <CardDescription className="text-base">
            Bento is the AI life-admin assistant that automatically finds wasted
            subscriptions, negotiates your bills lower, files refunds, and tracks
            warranties — while you sleep.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
              <Zap className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium">Auto-Save</p>
                <p className="text-xs text-muted-foreground">
                  Finds $500–$2,000/year automatically
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium">Secure</p>
                <p className="text-muted-foreground">
                  Bank-grade encryption, read-only access
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
              <PiggyBank className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium">Free to Start</p>
                <p className="text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
              <Sparkles className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium">AI-Powered</p>
                <p className="text-muted-foreground">
                  Works 24/7 in the background
                </p>
              </div>
            </div>
          </div>

          {refCode && stored && (
            <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3 text-center">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                🎉 Your friend&apos;s referral has been saved!{" "}
                <span className="font-medium">Get your first month free</span>{" "}
                when you subscribe.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3 pb-6">
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            size="lg"
            onClick={() => router.push("/signup")}
          >
            Start Your Free Scan
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            No credit card required. Average users save over $500/year.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm animate-pulse">
              B
            </div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
