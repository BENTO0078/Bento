/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Bento",
  description:
    "Tips, guides, and insights on saving money, managing subscriptions, negotiating bills, and taking control of your financial life.",
  openGraph: {
    title: "Bento Blog — Save Smarter",
    description:
      "Tips, guides, and insights on saving money and taking control of your financial life.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main content with sidebar */}
      <div className="flex-1">
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content area */}
            <main className="flex-1 min-w-0">{children}</main>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 space-y-8">
              {/* CTA Card */}
              <div className="rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 p-6">
                <h3 className="font-bold text-lg mb-2">
                  Find your hidden savings
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The average Bento user saves $1,200/year. Start your free scan
                  today.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Start Free Scan
                </Link>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  No credit card required
                </p>
              </div>

              {/* Categories */}
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-3">Categories</h3>
                <ul className="space-y-2">
                  {[
                    "Subscriptions",
                    "Bills & Utilities",
                    "Personal Finance",
                    "Saving Tips",
                    "AI & Automation",
                  ].map((cat) => (
                    <li key={cat}>
                      <Link
                        href="/blog"
                        className="text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular posts */}
              <div className="rounded-xl border p-5">
                <h3 className="font-semibold text-sm mb-3">Popular Posts</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/blog/forgotten-subscriptions"
                      className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2"
                    >
                      10 Subscriptions You're Probably Still Paying For
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog/negotiate-internet-bill"
                      className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2"
                    >
                      How to Negotiate Your Internet Bill
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog/hidden-cost-of-life-admin"
                      className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2"
                    >
                      The Hidden Cost of Life Admin
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

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
