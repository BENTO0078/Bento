"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search, CheckCircle2, XCircle } from "lucide-react";

interface ScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ScanStep = "idle" | "scanning" | "complete";

interface ScanResult {
  label: string;
  found: boolean;
}

const MOCK_SCAN_RESULTS: ScanResult[] = [
  { label: "Subscriptions", found: true },
  { label: "Bills", found: true },
  { label: "Refunds", found: false },
  { label: "Warranties", found: true },
  { label: "Price drops", found: false },
];

export function ScanModal({ open, onOpenChange }: ScanModalProps) {
  const [step, setStep] = useState<ScanStep>("idle");
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleScan = () => {
    setStep("scanning");
    setResults([]);

    // Simulate progressive results
    MOCK_SCAN_RESULTS.forEach((result, index) => {
      setTimeout(() => {
        setResults((prev) => [...prev, result]);
        if (index === MOCK_SCAN_RESULTS.length - 1) {
          setTimeout(() => setStep("complete"), 400);
        }
      }, (index + 1) * 600);
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setStep("idle");
      setResults([]);
    }
    onOpenChange(open);
  };

  const foundCount = results.filter((r) => r.found).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-emerald-600" />
            Scan for Savings
          </DialogTitle>
          <DialogDescription>
            Bento scans your connected accounts to find hidden savings
            opportunities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === "idle" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                <Search className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Ready to find savings?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll scan subscriptions, bills, refunds, warranties, and
                  price drops.
                </p>
              </div>
              <Button
                onClick={handleScan}
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
              >
                <Search className="mr-2 h-4 w-4" />
                Start Scan
              </Button>
            </div>
          )}

          {step === "scanning" && (
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning your accounts...
              </div>
              {results.map((result) => (
                <div
                  key={result.label}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm">{result.label}</span>
                  {result.found ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
              {results.length < MOCK_SCAN_RESULTS.length && (
                <div className="flex items-center justify-between rounded-lg border p-3 animate-pulse">
                  <span className="text-sm text-muted-foreground">
                    Scanning...
                  </span>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          )}

          {step === "complete" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Scan complete!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Found {foundCount} savings opportunities across{" "}
                  {results.length} categories.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleClose(false)}
              >
                View Results
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
