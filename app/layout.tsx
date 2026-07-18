import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { RootProviders } from "@/components/shared/root-providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bento — AI Life Admin",
  description:
    "Bento is an AI life-admin assistant that plugs into your financial accounts and automatically saves you money — every week, forever. Cancel forgotten subscriptions, negotiate bills, file refunds, track warranties, and more.",
  openGraph: {
    title: "Bento — AI Life Admin",
    description:
      "Automatically save money on subscriptions, bills, refunds, and warranties.",
    url: "https://bento.app",
    siteName: "Bento",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bento — AI Life Admin",
    description:
      "Automatically save money on subscriptions, bills, refunds, and warranties.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RootProviders>
            {children}
            <Analytics />
            <SpeedInsights />
          </RootProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
