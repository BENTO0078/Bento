import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Free Bill Negotiation Script Generator — Save on Internet, Phone & Insurance | Bento",
  description:
    "Generate a personalized negotiation script in 30 seconds. Works for Comcast, AT&T, Verizon, Spectrum & more. Copy, paste, and save money.",
  openGraph: {
    title:
      "Free Bill Negotiation Script Generator — Save on Internet, Phone & Insurance | Bento",
    description:
      "Generate a personalized negotiation script in 30 seconds. Works for Comcast, AT&T, Verizon, Spectrum & more. Copy, paste, and save money.",
    url: "https://bento.app/tools/bill-negotiator",
    siteName: "Bento",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Free Bill Negotiation Script Generator — Save on Internet, Phone & Insurance | Bento",
    description:
      "Generate a personalized negotiation script in 30 seconds. Works for Comcast, AT&T, Verizon, Spectrum & more. Copy, paste, and save money.",
  },
};

export default function BillNegotiatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
