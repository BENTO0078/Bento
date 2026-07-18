"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  BadgeCheck,
  Mail,
  Bell,
  Check,
  Loader2,
  Sparkles,
  Trophy,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LaunchPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // In production: POST to /api/launch/subscribe
    // For now, simulate success
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
              B
            </div>
            <span className="text-primary">Bento</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/20" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl" />

          <div className="container relative py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-1.5 text-sm font-bold text-amber-700 dark:text-amber-300 mb-8 animate-pulse">
                <Rocket className="h-4 w-4" />
                Launching on Product Hunt
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  Bento
                </span>{" "}
                is launching on
                <br />
                <span className="text-amber-500">Product Hunt</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                The AI life-admin assistant that saves you $500-$2,000/year —
                automatically. Be one of the first to know when we go live.
              </p>

              {/* Key stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">Average savings: $1,200/yr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">4.9/5 from 2,300+ reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">50,000+ users</span>
                </div>
              </div>

              {/* Email capture */}
              <div className="max-w-md mx-auto">
                {submitted ? (
                  <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
                      <Check className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      You&apos;re on the list! 🎉
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      We&apos;ll notify you the moment Bento launches on Product
                      Hunt. Early supporters get a special badge.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                              "🚀 I just signed up for early access to @bento — the AI life-admin assistant that saves you $500-$2,000/year automatically. Launching on Product Hunt soon! Join me: https://bento.app/launch"
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Share on X
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 h-12 text-base"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            Notify Me
                            <Bell className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="text-sm text-red-500 text-left">{error}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      No spam, ever. We&apos;ll send you one email when we launch.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Early Adopter Badge */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                Early Adopter Perk
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Be one of the first 1,000 users
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                The first 1,000 people who sign up through our Product Hunt
                launch will receive a permanent{" "}
                <strong className="text-foreground">
                  Early Adopter badge
                </strong>{" "}
                on their Bento profile — visible on the leaderboard and share
                cards forever. Plus a lifetime 20% discount on any plan.
              </p>

              {/* Badge preview */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 px-5 py-2.5 text-sm font-bold text-amber-700 dark:text-amber-300 shadow-lg">
                <BadgeCheck className="h-4 w-4" />
                Early Adopter · Bento Launch 2026
                <Sparkles className="h-4 w-4" />
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Limited to 1,000 badges. First come, first served.
              </p>
            </div>
          </div>
        </section>

        {/* How Bento Works */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                What Bento does for you
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Bento works continuously in the background — finding money while
                you sleep.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {[
                {
                  title: "Cancel Subscriptions",
                  description:
                    "Finds forgotten subscriptions and cancels them for you.",
                  icon: "📋",
                  color: "bg-red-100 dark:bg-red-900/20",
                },
                {
                  title: "Negotiate Bills",
                  description:
                    "Gets your internet, phone, and insurance bills lowered.",
                  icon: "💰",
                  color: "bg-blue-100 dark:bg-blue-900/20",
                },
                {
                  title: "File Refunds",
                  description:
                    "Claims price-drop and late-delivery refunds automatically.",
                  icon: "🔄",
                  color: "bg-amber-100 dark:bg-amber-900/20",
                },
                {
                  title: "Track Warranties",
                  description:
                    "Never miss a warranty expiration or repair window.",
                  icon: "🛡️",
                  color: "bg-purple-100 dark:bg-purple-900/20",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border bg-card p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.color} text-2xl mb-4`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="py-16 bg-muted/30">
          <div className="container text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Help spread the word
            </h2>
            <p className="text-muted-foreground mb-8">
              Share Bento with your friends and help them stop leaking money.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                className="gap-2 border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      "🚀 @bento is launching on Product Hunt — the AI that saves you $500-$2,000/year automatically. Get notified: https://bento.app/launch"
                    )}`,
                    "_blank"
                  );
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "🚀 Bento is launching on Product Hunt — the AI that saves you $500-$2,000/year automatically. Get notified: https://bento.app/launch"
                  );
                }}
              >
                <Sparkles className="h-4 w-4" />
                Copy Launch Message
              </Button>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Don&apos;t miss the launch
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Be the first to know when Bento hits Product Hunt. Early
                supporters get a permanent badge and 20% lifetime discount.
              </p>
              <div className="max-w-md mx-auto">
                {submitted ? (
                  <div className="text-center">
                    <Check className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold">
                      You&apos;re all set! 🎉
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll email you at {email} when we launch.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      className="h-12"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 font-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Notify Me"
                      )}
                    </Button>
                  </form>
                )}
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 py-10">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bento. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
