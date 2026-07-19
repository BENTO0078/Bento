import type { Metadata } from "next";
import Calculator from "@/components/calculator/calculator";

export const metadata: Metadata = {
  title: "How Much Are You Losing? — Bento Calculator",
  description:
    "Find out how much money you're losing on forgotten subscriptions, overpriced bills, unclaimed refunds, and unused boxes. Free 30-second quiz from Bento.",
  openGraph: {
    title: "How Much Are You Losing? — Bento Calculator",
    description:
      "Take our 30-second quiz to see how much money leaks from your accounts every year. The average person loses $500–$2,000.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Are You Losing? — Bento Calculator",
    description:
      "Take our 30-second quiz to see how much money you're losing. The average person loses $500–$2,000/year.",
  },
};

/** FAQPage JSON-LD schema for SEO rich results */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the Bento calculator estimate my annual losses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The calculator uses real-world averages: 30% of streaming subscriptions go unused, internet bills are overpriced by $15–$25/month on average, 3% of online purchases qualify for unclaimed refunds, warranty claims worth ~$50/item/year go missed, and 50% of subscription boxes are underused. We combine your answers with these benchmarks to estimate your total annual loss.",
      },
    },
    {
      "@type": "Question",
      name: "How does Bento actually save me money?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bento connects to your financial accounts and automatically: cancels forgotten subscriptions, negotiates bills lower with providers, files refunds for price drops and late deliveries, tracks warranties so you never miss a claim, and monitors your credit. It works continuously in the background with zero effort from you.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Bento calculator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the calculator is completely free and takes about 30 seconds. No signup required. If you want Bento to actually save the money it finds, you can start a 30-day free trial — no credit card needed.",
      },
    },
    {
      "@type": "Question",
      name: "How much does the average Bento user save?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The average Bento customer saves between $500 and $2,000 per year. Savings come from subscription cancellations, bill negotiations, refunds, warranty claims, and credit optimization.",
      },
    },
    {
      "@type": "Question",
      name: "Is Bento secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Bento uses bank-level 256-bit encryption, never sells your data, and only accesses your accounts with read and cancel permissions — we never move your money. Your data is protected by the same security standards used by major financial institutions.",
      },
    },
    {
      "@type": "Question",
      name: "What types of subscriptions can Bento find?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bento scans your bank and credit card statements to identify streaming services, software subscriptions, gym memberships, box subscriptions, insurance policies, and any recurring payment you've set up. It surfaces all of them in one dashboard and can cancel them with one click.",
      },
    },
  ],
};

export default function CalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            How Much Are You Losing?
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Answer 5 quick questions and we&apos;ll estimate how much money leaks
            from your accounts every year — then show you exactly how Bento plugs
            the holes.
          </p>
        </div>
        <Calculator />
      </div>
    </>
  );
}
