import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Free Subscription Waste Calculator — Find Forgotten Subscriptions | Bento",
  description:
    "Answer 4 quick questions and discover how much money you're wasting on forgotten subscriptions, free trials, and unused memberships. Takes 30 seconds.",
  openGraph: {
    title:
      "Free Subscription Waste Calculator — Find Forgotten Subscriptions | Bento",
    description:
      "Answer 4 quick questions and discover how much money you're wasting on forgotten subscriptions, free trials, and unused memberships. Takes 30 seconds.",
    url: "https://bento.app/tools/subscription-detector",
    siteName: "Bento",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Free Subscription Waste Calculator — Find Forgotten Subscriptions | Bento",
    description:
      "Answer 4 quick questions and discover how much money you're wasting on forgotten subscriptions, free trials, and unused memberships. Takes 30 seconds.",
  },
};

export default function SubscriptionDetectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
