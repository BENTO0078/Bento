import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "./data";
import { ArrowRight, Clock, Calendar } from "lucide-react";

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

export default function BlogIndex() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
          Bento Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Tips, guides, and insights on saving money, managing subscriptions,
          negotiating bills, and taking control of your financial life.
        </p>
      </div>

      {/* Featured post (first) */}
      {blogPosts.length > 0 && (
        <Link
          href={`/blog/${blogPosts[0].slug}`}
          className="group block mb-12"
        >
          <article className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {blogPosts[0].category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(blogPosts[0].date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {blogPosts[0].title}
              </h2>
              <p className="text-muted-foreground mb-4">
                {blogPosts[0].description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                Read full article
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </article>
        </Link>
      )}

      {/* Remaining posts grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {blogPosts.slice(1).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="rounded-xl border bg-card p-6 h-full hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-800">
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
