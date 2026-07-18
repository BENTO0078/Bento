export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "forgotten-subscriptions",
    title: "10 Subscriptions You're Probably Still Paying For (And How to Cancel Them)",
    description:
      "The average American has 3-4 forgotten subscriptions draining $500+ per year from their bank account. Here's how to find and cancel them — automatically.",
    date: "2026-07-15",
    author: "Bento Team",
    readTime: "7 min read",
    category: "Subscriptions",
  },
  {
    slug: "negotiate-internet-bill",
    title: "How to Negotiate Your Internet Bill: The Exact Script That Works",
    description:
      "A step-by-step guide to negotiating your internet bill lower — including the exact scripts and phrases that save customers $20-40/month on average.",
    date: "2026-07-10",
    author: "Bento Team",
    readTime: "8 min read",
    category: "Bills & Utilities",
  },
  {
    slug: "hidden-cost-of-life-admin",
    title: "The Hidden Cost of Life Admin: Why You're Losing $2,000/Year",
    description:
      "Between forgotten subscriptions, overpriced bills, missed refunds, and expired warranties, the average household bleeds $2,000+ annually. Here's the breakdown — and how AI is changing the game.",
    date: "2026-07-05",
    author: "Bento Team",
    readTime: "9 min read",
    category: "Personal Finance",
  },
];
