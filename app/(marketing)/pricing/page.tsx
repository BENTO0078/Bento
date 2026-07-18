import Link from "next/link";

const tiers = [
  {
    name: "Consumer",
    price: "$19",
    period: "/month",
    description:
      "Perfect for individuals who want to automate their financial life.",
    features: [
      "All automations included",
      "Unlimited linked accounts",
      "Subscription cancellation",
      "Bill negotiation",
      "Refund filing",
      "Warranty tracking",
      "Tax document organization",
      "Credit monitoring",
      "Weekly savings report",
    ],
    cta: "Start Free Trial",
    href: "/signup?tier=consumer",
    featured: false,
  },
  {
    name: "Family",
    price: "$49",
    period: "/month",
    description: "For households — up to 4 members, shared savings dashboard.",
    features: [
      "Everything in Consumer",
      "Up to 4 family members",
      "Shared savings dashboard",
      "Family warranty tracking",
      "Joint account support",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup?tier=family",
    featured: true,
  },
  {
    name: "Concierge",
    price: "$99",
    period: "/month",
    description:
      "White-glove service with human-in-the-loop for complex negotiations.",
    features: [
      "Everything in Family",
      "Human-in-the-loop support",
      "Complex negotiations handled",
      "Insurance appeals",
      "Medical bill audits",
      "Dedicated account manager",
      "Same-day response",
    ],
    cta: "Contact Sales",
    href: "/signup?tier=concierge",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every plan pays for itself many times over. The average customer
            saves $500–$2,000/year. Start with a 30-day free trial — no credit
            card required.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                tier.featured
                  ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
                  : "shadow-sm"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors w-full ${
                  tier.featured
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "border hover:bg-muted"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
