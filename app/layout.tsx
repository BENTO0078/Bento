import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { RootProviders } from "@/components/shared/root-providers";
import { ServiceWorkerRegistration } from "@/components/shared/sw-register";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bento — AI Life Admin",
  description:
    "Bento is an AI life-admin assistant that plugs into your financial accounts and automatically saves you money — every week, forever. Cancel forgotten subscriptions, negotiate bills, file refunds, track warranties, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Bento",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
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
      <head>
        {/* Explicit PWA meta tags for maximum cross-browser compatibility */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bento" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#10b981" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
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
            <ServiceWorkerRegistration />
          </RootProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
