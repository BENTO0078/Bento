"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
} from "lucide-react";

interface ShareCardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savingsScore: number;
  totalFound: number;
  rank?: number;
  totalUsers?: number;
}

export function ShareCard({
  open,
  onOpenChange,
  savingsScore,
  totalFound,
  rank,
  totalUsers,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const shareText = `My Bento Savings Score is ${savingsScore} 🔥 I've found ${formatCurrency(totalFound)} in hidden savings this year. Try a free scan:`;

  const handleCopyImage = useCallback(async () => {
    if (!cardRef.current) return;
    setCopying(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
      // Fallback: download the image
      const dataUrl = await toPng(cardRef.current!, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "bento-savings-score.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setCopying(false);
    }
  }, []);

  const handleTwitterShare = useCallback(() => {
    const url = encodeURIComponent("https://bento.app");
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  }, [shareText]);

  const handleRedditShare = useCallback(() => {
    const url = encodeURIComponent("https://bento.app");
    const title = encodeURIComponent(
      `My Bento Savings Score is ${savingsScore} — I found ${formatCurrency(totalFound)} in hidden savings this year`
    );
    window.open(
      `https://www.reddit.com/r/personalfinance/submit?url=${url}&title=${title}`,
      "_blank"
    );
  }, [savingsScore, totalFound]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = "bento-savings-score.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download:", err);
    }
  }, []);

  // Score tier effects
  const getScoreTier = (score: number) => {
    if (score >= 800) return { label: "Elite Saver", gradient: "from-emerald-600 via-emerald-500 to-teal-500" };
    if (score >= 600) return { label: "Pro Saver", gradient: "from-emerald-500 via-teal-500 to-cyan-500" };
    if (score >= 400) return { label: "Smart Saver", gradient: "from-amber-500 via-yellow-500 to-orange-400" };
    return { label: "Rising Saver", gradient: "from-gray-500 via-gray-400 to-gray-300" };
  };

  const tier = getScoreTier(savingsScore);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-500" />
              Share Your Score
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5">
          {/* The share card preview */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 p-6 shadow-xl"
            style={{ minHeight: 280 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/60 to-transparent dark:from-emerald-900/20 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-100/40 to-transparent dark:from-amber-900/10 rounded-tr-full" />

            <div className="relative z-10 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
                  B
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">Bento</span>
                <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  {tier.label}
                </span>
              </div>

              {/* Big Score */}
              <div className="text-center py-3">
                <p className="text-sm text-muted-foreground mb-1">Savings Score</p>
                <div className={cn(
                  "text-7xl font-black bg-gradient-to-r bg-clip-text text-transparent",
                  tier.gradient
                )}>
                  {savingsScore}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Total Found</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(totalFound)}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-3 text-center">
                  <p className="text-xs text-muted-foreground">This Year</p>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {formatCurrency(totalFound)}
                  </p>
                </div>
              </div>

              {/* Rank info if available */}
              {rank && totalUsers && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Ranked <span className="font-bold text-foreground">#{rank.toLocaleString()}</span> out of{" "}
                    <span className="font-medium">{totalUsers.toLocaleString()}+</span> savers
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center pt-1">
                <p className="text-[10px] text-muted-foreground">
                  bento.app — Find your hidden savings
                </p>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-center text-muted-foreground">
              Share your win with the world
            </p>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="gap-2 border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50"
                onClick={handleTwitterShare}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </Button>

              <Button
                variant="outline"
                className="gap-2 border-[#FF4500]/30 hover:bg-[#FF4500]/10 hover:text-[#FF4500] hover:border-[#FF4500]/50"
                onClick={handleRedditShare}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.48 11.91c.69 0 1.25.56 1.25 1.25s-.56 1.25-1.25 1.25c-.37 0-.71-.17-.94.55-.82 4.08-4.27 7.03-8.54 7.03s-7.72-2.95-8.54-7.03c-.23-.72-.57-.55-.94-.55-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25c.45 0 .84.24 1.07.59.03-.18.07-.36.11-.54.46-2.55 2.26-4.63 4.79-5.26l.91-4.28 3.15.67c.36-.27.8-.43 1.28-.43 1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2c0-.13.01-.26.04-.38l-2.36-.5-.68 3.19c2.39.69 4.06 2.67 4.52 5.1.04.18.08.36.11.54.23-.35.62-.59 1.07-.59zM8.88 13.41c-.74 0-1.33.72-1.33 1.61s.6 1.61 1.33 1.61 1.33-.72 1.33-1.61-.6-1.61-1.33-1.61zm6.24 0c-.74 0-1.33.72-1.33 1.61s.6 1.61 1.33 1.61 1.33-.72 1.33-1.61-.6-1.61-1.33-1.61zm-5.61 3.84c.42.63 1.21 1.13 2.49 1.13s2.07-.5 2.49-1.13c.17-.26.48-.33.74-.16.26.17.33.48.16.74-.62.93-1.74 1.64-3.39 1.64s-2.77-.71-3.39-1.64c-.17-.26-.09-.57.16-.74.26-.17.57-.09.74.16z"/>
                </svg>
                r/personalfinance
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleCopyImage}
                disabled={copying}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    Copied!
                  </>
                ) : copying ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Image
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              Copy Image copies the card as a PNG to your clipboard for easy sharing
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Compact trigger button for dashboard header */
export function ShareScoreButton({
  savingsScore,
  totalFound,
  rank,
  totalUsers,
  className,
}: {
  savingsScore: number;
  totalFound: number;
  rank?: number;
  totalUsers?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-1.5 font-medium", className)}
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Share Your Score</span>
        <span className="sm:hidden">Share</span>
      </Button>
      <ShareCard
        open={open}
        onOpenChange={setOpen}
        savingsScore={savingsScore}
        totalFound={totalFound}
        rank={rank}
        totalUsers={totalUsers}
      />
    </>
  );
}
