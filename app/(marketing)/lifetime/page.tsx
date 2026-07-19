import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Zap,
  RefreshCw,
  CreditCard,
  BadgeCheck,
  Infinity,
  Gift,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import FlashSaleCountdown from "@/components/marketing/flash-sale-countdown";
import SoldCounter from "@/components/marketing/sold-counter";

export const metadata: Metadata = {
  title: "Get Bento Lifetime Access — $99 Flash Sale",
  description:
    "24-hour flash sale: Pay once, keep Bento for life. Unlimited subscription tracking, automatic bill negotiation, refund filing, warranty tracking, credit monitoring, and all future features — only $99 today.",
  openGraph: {
    title: "Get Bento Lifetime Access — $99 Flash Sale",
    description:
      "24-hour flash sale: Pay once, keep Bento for life. Unlimited subscription tracking, automatic bill negotiation, refund filing, warranty tracking, credit monitoring, and all future features included. Normally $199.",
    url: "https://bento.app/lifetime",
    siteName: "Bento",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Bento Lifetime Access — $99 Flash Sale",
    description:
      "24-hour flash sale: Pay once, keep Bento for life. All features, all future updates. No recurring fees, ever.",
  },
};

const STRIPE_LINK = "https://buy.stripe.com/cNibJ07r8fBg10cX81ZS05";

const features = [
  {
    title: "Unlimited Subscription Tracking",
    description:
      "Bento scans every bank and credit card account you link — no caps, no limits. Find every subscription you're paying for.",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Automatic Bill Negotiation",
    description:
      "Our AI negotiates with internet, cable, insurance, and phone providers on your behalf. Lower bills without lifting a finger.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Refund Filing",
    description:
      "Price drops, late deliveries, service outages — Bento files refund claims automatically whenever you're owed money.",
    icon: <RefreshCw className="h-5 w-5" />,
  },
  {
    title: "Warranty Tracking",
    description:
      "Never lose a warranty again. Bento tracks every purchase receipt and alerts you before coverage expires.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Credit Monitoring",
    description:
      "Automated credit score tracking with alerts for changes and personalized improvement recommendations.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Savings Score & Leaderboard",
    description:
      "Earn a Savings Score for every dollar saved. Compete on the leaderboard and share your wins.",
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: "All Future Features Included",
    description:
      "Every feature we build — tax document organization, medical bill audits, family plans, and more — is yours forever.",
    icon: <Infinity className="h-5 w-5" />,
  },
  {
    title: "No Recurring Fees, Ever",
    description:
      "Pay $99 once and you're done. No monthly charges, no annual renewals, no surprise price hikes. Bento works for you forever.",
    icon: <Gift className="h-5 w-5" />,
  },
];

const testimonials = [
  {
    quote:
      "I bought the lifetime deal 4 months ago and Bento has already saved me $1,340. The bill negotiation alone got my internet down by $35/month. Best money I've ever spent.",
    name: "Sarah Chen",
    role: "Product Designer",
  },
  {
    quote:
      "I was skeptical about 'lifetime' deals, but Bento has been a game-changer. Found 7 subscriptions I forgot about and negotiated my car insurance down. ROI in under 1 month at this price.",
    name: "Marcus Johnson",
    role: "Software Engineer",
  },
  {
    quote:
      "The peace of mind alone is worth it. Knowing Bento is constantly watching for refunds, tracking warranties, and monitoring my credit — I don't have to think about any of it.",
    name: "Rachel Kim",
    role: "Marketing Director",
  },
];

const faqs = [
  {
    question: "Is this really a lifetime deal?",
    answer:
      "Yes — one payment of $99 gives you lifetime access to Bento's Consumer plan. No monthly fees, no annual charges, no expiration. As long as Bento exists, your account stays active with full access.",
  },
  {
    question: "What if Bento shuts down?",
    answer:
      "We're building Bento for the long haul with a sustainable business model. In the unlikely event we ever had to shut down, we'd provide at least 12 months notice and help you export all your data. And with our 30-day money-back guarantee, your purchase is protected.",
  },
  {
    question: "Can I upgrade to Family or Concierge later?",
    answer:
      "Lifetime deal holders get the Consumer plan forever. If you want to add Family (up to 4 members) or Concierge (human-in-the-loop support), you can upgrade at a deeply discounted rate — lifetime members get 50% off any plan upgrade.",
  },
  {
    question: "How many accounts can I link?",
    answer:
      "Unlimited. Link as many bank accounts, credit cards, and email accounts as you want. Bento's lifetime deal includes unlimited account linking — no caps.",
  },
  {
    question: "Do I get new features as they're released?",
    answer:
      "Absolutely. Every new feature we build — tax document organization, medical bill audits, price-drop alerts, and whatever comes next — is included in your lifetime plan at no extra cost.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Bento uses bank-level 256-bit encryption for all data. We never store your banking credentials — we use Plaid for secure account linking. Your financial data is read-only; Bento can never move your money.",
  },
  {
    question: "What happens after I buy?",
    answer:
      "You'll receive an email with a link to create your Bento account. Once you're in, connect your accounts and Bento starts scanning immediately. Most users see their first savings within 48 hours.",
  },
  {
    question: "How does the 30-day money-back guarantee work?",
    answer:
      "If Bento doesn't save you at least $99 in your first year, we'll refund every penny. But we're confident you'll save that in your first month. Just email support@bento.app within 30 days of purchase — no questions asked.",
  },
];

export default function LifetimePage() {
  return (
    <div className="flex flex-col">
      {/* ── Flash Sale Countdown Banner ── */}
      <div className="bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-800">
        <div className="container py-3 text-center">
          <FlashSaleCountdown />
        </div>
      </div>

      {/* ── Flash Sale Urgency Banner ── */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
        <div className="container py-2.5 text-center">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
            ⚡ Flash Sale: $99 lifetime access. Price returns to $199 in 24 hours.
          </p>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-transparent to-transparent dark:from-emerald-950/15 pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative text-center">
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-red-400 bg-red-50 dark:bg-red-950/30 px-4 py-1.5 text-sm font-bold text-red-700 dark:text-red-300 mb-6 animate-pulse">
              <Sparkles className="h-4 w-4" />
              24-Hour Flash Sale
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
              Get Bento Forever
              <br />
              <span className="text-primary">Only $99 Today</span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl mb-2">
              <span className="line-through text-muted-foreground/60">$199</span>{" "}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                $99
              </span>{" "}
              — one payment, lifetime access. Normally $228/year.
            </p>

            <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-8">
              ⏰ This price disappears in 24 hours. Don&apos;t miss it.
            </p>

            {/* CTA Button */}
            <a
              href={STRIPE_LINK}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Lifetime Access — $99
              <ArrowRight className="h-5 w-5" />
            </a>

            <p className="text-sm text-muted-foreground mt-4">
              30-day money-back guarantee &middot; Secure Stripe checkout
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-border/50 flex-wrap">
              <SoldCounter />
              <div className="hidden sm:block h-5 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  30-day money-back guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI Section ── */}
      <section className="py-16 bg-emerald-50/50 dark:bg-emerald-950/10 border-y">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              The Math Is Simple
            </h2>
            <div className="grid gap-6 sm:grid-cols-3 mt-8">
              <div className="rounded-xl bg-background border p-6">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  $847
                </div>
                <div className="text-sm text-muted-foreground">
                  Average annual savings per Bento user
                </div>
              </div>
              <div className="rounded-xl bg-background border p-6 ring-2 ring-red-400 ring-offset-2">
                <div className="text-3xl font-bold text-primary mb-1">$99</div>
                <div className="text-sm text-muted-foreground">
                  One-time flash sale price{" "}
                  <span className="line-through text-muted-foreground/50">
                    $199
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-background border p-6">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  6 weeks
                </div>
                <div className="text-sm text-muted-foreground">
                  Until you&apos;re in profit — forever
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground mt-8">
              The average Bento user saves $847/year. You pay $99 once. After
              about 6 weeks, you&apos;re in profit forever.
            </p>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything included, forever
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One payment unlocks the full Bento Consumer plan — every feature,
              every future update, zero recurring fees.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What lifetime members say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t take our word for it. Here&apos;s what early lifetime
              buyers are saying.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border bg-card p-6 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about the Bento lifetime deal.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border bg-card p-6"
              >
                <h3 className="font-semibold text-sm mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Money-Back Guarantee ── */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
              <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              30-Day Money-Back Guarantee
            </h2>
            <p className="text-lg text-muted-foreground">
              If Bento doesn&apos;t save you at least $99 in your first year,
              we&apos;ll refund every penny. No questions asked. We&apos;re that
              confident you&apos;ll save more than you paid — usually in your
              first month.
            </p>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            One payment. Lifetime savings.
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Pay $99 once and Bento saves you money every month, forever. 30-day
            money-back guarantee. This price ends in 24 hours.
          </p>
          <a
            href={STRIPE_LINK}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-10 py-5 text-lg font-bold text-primary shadow-xl hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Lifetime Access — $99
            <ArrowRight className="h-5 w-5" />
          </a>
          <p className="text-sm text-primary-foreground/60 mt-4">
            Secure checkout via Stripe &middot; Instant account activation
          </p>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div className="bg-background border-t py-6">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">
            Questions about the lifetime deal?{" "}
            <Link
              href="/support"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Contact our team
            </Link>{" "}
            — we&apos;re happy to help. &copy; {new Date().getFullYear()} Bento.
          </p>
        </div>
      </div>
    </div>
  );
}
