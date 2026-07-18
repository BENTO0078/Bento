import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "../data";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ForgottenSubscriptionsPost from "../content/forgotten-subscriptions";
import NegotiateInternetBillPost from "../content/negotiate-internet-bill";
import HiddenCostOfLifeAdminPost from "../content/hidden-cost-of-life-admin";

const postComponents: Record<
  string,
  React.ComponentType<Record<string, never>>
> = {
  "forgotten-subscriptions": ForgottenSubscriptionsPost,
  "negotiate-internet-bill": NegotiateInternetBillPost,
  "hidden-cost-of-life-admin": HiddenCostOfLifeAdminPost,
};

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found — Bento" };

  return {
    title: `${post.title} — Bento Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const PostContent = postComponents[params.slug];
  if (!PostContent) notFound();

  return (
    <div>
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all articles
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {post.author}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground">{post.description}</p>
      </header>

      {/* Divider */}
      <hr className="mb-8" />

      {/* Content */}
      <PostContent />
    </div>
  );
}
