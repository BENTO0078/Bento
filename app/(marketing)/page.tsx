import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
            AI-powered life admin
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your money works harder
            <span className="text-primary"> while you sleep</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Bento plugs into your financial accounts and automatically saves you
            money — canceling forgotten subscriptions, negotiating bills lower,
            filing refunds, and tracking warranties. The average customer saves
            $500–$2,000/year with zero ongoing effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
            >
              Start Saving Now
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border px-8 py-4 text-base font-medium hover:bg-muted transition-colors"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            No credit card required &middot; 30-day free trial
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything your money needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bento works continuously in the background, finding and saving you
              money across every aspect of your financial life.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start saving money automatically.
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            Ready to stop leaking money?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of people who save an average of $1,200/year with
            Bento. Start your free trial today.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-base font-medium text-primary shadow-lg hover:bg-white/90 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Cancel Forgotten Subscriptions",
    description:
      "Bento scans your bank statements to find subscriptions you forgot about and cancels them for you — or flags them for your review.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
        <path d="m9 13 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Negotiate Bills Lower",
    description:
      "Our AI negotiates with providers on your behalf — internet, cable, insurance, phone plans. You pay less without lifting a finger.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Automatic Refunds",
    description:
      "Price drops, late deliveries, service outages — Bento files refund claims automatically when you're owed money.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
    ),
  },
  {
    title: "Warranty Tracking",
    description:
      "Never lose a warranty again. Bento tracks purchase receipts, warranty periods, and reminds you before coverage expires.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Tax Document Organization",
    description:
      "Bento automatically organizes receipts, donation records, and tax documents throughout the year so tax season is a breeze.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
  {
    title: "Credit Monitoring",
    description:
      "Stay on top of your credit score with automated monitoring, alerts for changes, and personalized improvement suggestions.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Connect Your Accounts",
    description:
      "Securely link your bank accounts, credit cards, and email. Bento uses bank-level encryption — we never store your credentials.",
  },
  {
    title: "AI Analyzes Everything",
    description:
      "Our AI scans your transactions, subscriptions, bills, and purchases to find every opportunity to save you money.",
  },
  {
    title: "Save Automatically",
    description:
      "Bento takes action — canceling, negotiating, filing refunds — and you get a weekly summary of money saved.",
  },
];
