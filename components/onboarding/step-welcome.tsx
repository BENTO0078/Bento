"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ScanSearch,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Building2,
  Wallet,
} from "lucide-react";

interface StepWelcomeProps {
  onStart: () => void;
}

export function StepWelcome({ onStart }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-pulse" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
            <ScanSearch className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Let&apos;s find your hidden money
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Bento scans your accounts to find forgotten subscriptions, overpriced
            bills, and missed refunds — then fixes them automatically.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-medium gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Subscriptions
          </Badge>
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-medium gap-1.5"
          >
            <Building2 className="h-3.5 w-3.5" />
            Bills
          </Badge>
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-medium gap-1.5"
          >
            <Wallet className="h-3.5 w-3.5" />
            Refunds
          </Badge>
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-medium gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Warranties
          </Badge>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm">Bank-level security</p>
                <p className="text-xs text-muted-foreground">
                  Read-only access. We never move your money — we just find it.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
            <CardContent className="p-4 flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm">$847 avg. found</p>
                <p className="text-xs text-muted-foreground">
                  The average user discovers $847 in potential savings on their
                  first scan.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Button
          onClick={onStart}
          size="lg"
          className="w-full sm:w-auto min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
        >
          Start Scan
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-xs text-muted-foreground">
          No bank connection needed for this demo — we&apos;ll simulate a scan to
          show you what Bento finds.
        </p>
      </div>
    </div>
  );
}
