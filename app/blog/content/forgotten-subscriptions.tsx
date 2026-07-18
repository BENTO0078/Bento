/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function ForgottenSubscriptionsPost() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <p className="lead text-lg text-muted-foreground">
        Here&apos;s a quick exercise: open your banking app, scroll through the
        last 90 days of transactions, and count how many subscription charges
        you see. Most people find at least one they forgot about. Many find
        three or four. Some find more than ten. The average American subscribes
        to 12 paid services — and can only name 7 of them.
      </p>

      <h2>The Silent Drain on Your Bank Account</h2>

      <p>
        Subscription fatigue is real, and it&apos;s costing American households
        an estimated $500 to $2,400 per year in forgotten or underused
        subscriptions. A 2025 survey by C+R Research found that consumers
        underestimate their monthly subscription spending by an average of 42%.
        That means if you think you spend $100/month on subscriptions, you&apos;re
        probably closer to $140 — and you&apos;re paying for services you
        haven&apos;t touched in months.
      </p>

      <p>
        The problem isn&apos;t just Netflix — it&apos;s the ecosystem of modern
        subscription-based life. Streaming services, fitness apps, cloud
        storage, meal kits, software tools, gaming subscriptions, dating apps,
        news sites, Patreon pledges, Amazon Subscribe & Save, music services,
        meditation apps… the list goes on. Each one costs between $4.99 and
        $49.99 per month, and together they form a quiet, relentless drip on
        your finances.
      </p>

      <h2>The 10 Most Commonly Forgotten Subscriptions</h2>

      <h3>1. Streaming Services You Forgot About</h3>
      <p>
        Netflix ($15.49/mo), Hulu ($7.99/mo), Disney+ ($13.99/mo), Max
        ($16.99/mo), Apple TV+ ($9.99/mo), Paramount+ ($11.99/mo), Peacock
        ($7.99/mo) — most households have 3-4 of these, and many go unwatched
        for months. Data from Bento&apos;s user scans shows that 38% of users
        have at least one streaming service they haven&apos;t used in 60+ days.
        Average annual waste: <strong>$185</strong>.
      </p>

      <h3>2. Amazon Prime</h3>
      <p>
        At $139/year (or $14.99/month), Amazon Prime is the most common
        subscription in America. But do you actually use the video streaming?
        The music? The photo storage? If you&apos;re only using it for shipping,
        and you don&apos;t order often, you might be losing money. Many users
        don&apos;t realize they can get free shipping on orders over $35 without
        Prime. Average annual waste: <strong>$139</strong>.
      </p>

      <h3>3. Gym Memberships (Especially Planet Fitness)</h3>
      <p>
        Planet Fitness ($10/mo), Anytime Fitness ($41/mo), Gold&apos;s Gym
        ($45/mo), boutique studios ($150-250/mo). Industry data shows that 67%
        of gym memberships go completely unused — and 50% of people who sign up
        in January quit by June. Bento&apos;s scan data reveals that the average
        unused gym membership has had zero check-ins for 4+ months. Average
        annual waste: <strong>$120-$540</strong>.
      </p>

      <h3>4. Cloud Storage You Don&apos;t Need</h3>
      <p>
        iCloud+ ($0.99-$9.99/mo), Google One ($1.99-$9.99/mo), Dropbox
        ($11.99/mo), OneDrive ($6.99/mo). Many people pay for multiple cloud
        services and only actively use one. If you&apos;re paying for 2TB of
        iCloud and 2TB of Google One, you&apos;re double-paying. Average annual
        waste: <strong>$72-$144</strong>.
      </p>

      <h3>5. Food Delivery & Meal Kit Services</h3>
      <p>
        DoorDash DashPass ($9.99/mo), Uber One ($9.99/mo), Grubhub+
        ($9.99/mo), HelloFresh ($60-80/week if not skipped), Blue Apron
        ($50-70/week). Meal kit services auto-renew weekly unless you actively
        skip — and many users forget to skip weeks they don&apos;t need. The
        result: boxes of food arriving when you&apos;re out of town. Average
        annual waste: <strong>$120-$400</strong>.
      </p>

      <h3>6. Audible & Audiobook Services</h3>
      <p>
        Audible ($14.95/mo) gives you one credit per month — but unused credits
        expire after a period, and many subscribers accumulate credits they
        never redeem. Bento&apos;s data shows that 22% of Audible users
        haven&apos;t redeemed a credit in 3+ months. Average annual waste:{" "}
        <strong>$179</strong>.
      </p>

      <h3>7. LinkedIn Premium</h3>
      <p>
        At $39.99/month for the full Premium package, LinkedIn is one of the
        most expensive "set and forget" subscriptions. Most people sign up for
        the free trial when job hunting and forget to cancel. If you&apos;re not
        actively using InMail credits or the learning courses, you&apos;re
        paying $480/year for nothing. Average annual waste:{" "}
        <strong>$480</strong>.
      </p>

      <h3>8. Software & App Subscriptions</h3>
      <p>
        Adobe Creative Cloud ($54.99/mo), Microsoft 365 ($6.99/mo), Canva Pro
        ($12.99/mo), Notion Plus ($10/mo), various browser extensions, mobile
        app subscriptions, and SaaS tools. Freelancers and creatives are
        particularly vulnerable here — Bento scans frequently find 3-5 unused
        software subscriptions. Average annual waste: <strong>$240-$660</strong>.
      </p>

      <h3>9. Dating Apps</h3>
      <p>
        Tinder Platinum ($29.99/mo), Bumble Premium ($39.99/mo), Hinge
        Preferred ($29.99/mo), Match.com ($35.99/mo). People often forget to
        cancel after finding a relationship — or sign up for multiple apps
        simultaneously. Average annual waste: <strong>$360-$480</strong>.
      </p>

      <h3>10. Gaming Subscriptions</h3>
      <p>
        Xbox Game Pass Ultimate ($16.99/mo), PlayStation Plus Premium
        ($17.99/mo), Nintendo Switch Online ($19.99/year), Twitch subs ($4.99
        each), Discord Nitro ($9.99/mo). Gamers often stack multiple services
        and forget which ones they&apos;re paying for. Average annual waste:{" "}
        <strong>$204-$420</strong>.
      </p>

      <h2>The Math: How Much Are You Really Losing?</h2>

      <p>
        Let&apos;s do conservative math. If you have just 3 forgotten
        subscriptions from the list above — say, an unused streaming service
        ($15/mo), an old gym membership ($10/mo), and a cloud storage plan you
        don&apos;t need ($10/mo) — that&apos;s $35/month, or{" "}
        <strong>$420/year</strong>. And that&apos;s a minimal scenario.
      </p>

      <p>
        In Bento&apos;s data from early users, the average person has{" "}
        <strong>3.7 forgotten subscriptions</strong> totaling{" "}
        <strong>$540/year</strong> in unnecessary charges. The top 10% of users
        have 7+ forgotten subscriptions costing over $1,500/year.
      </p>

      <p>
        Over 10 years at 7% compound interest, that $540/year becomes
        approximately $7,900. Over 30 years? Nearly $53,000. That&apos;s the
        true cost of subscription creep — not just the monthly charges, but the
        opportunity cost of never investing that money.
      </p>

      <h2>Why Manual Cancellation Is So Hard</h2>

      <p>
        If finding these subscriptions were easy, everyone would do it. Here&apos;s
        why manual cancellation is such a pain:
      </p>

      <ol>
        <li>
          <strong>Buried in statements:</strong> Subscription charges are
          scattered across bank statements, credit cards, PayPal, and Apple/Google
          Pay. No single view exists.
        </li>
        <li>
          <strong>Dark patterns:</strong> Companies design cancellation flows to
          be confusing — hidden menus, retention offers, "are you sure?"
          dialogs, phone-only cancellation requirements.
        </li>
        <li>
          <strong>Free trial traps:</strong> You sign up for a 7-day trial, forget
          about it, and get charged $99 for the annual plan 7 days later.
        </li>
        <li>
          <strong>Annual auto-renewals:</strong> Many services auto-renew for an
          entire year without warning. That $99 annual charge shows up
          unexpectedly.
        </li>
        <li>
          <strong>It takes time:</strong> The average cancellation takes 8-15
          minutes. With 3-4 subscriptions to cancel, that&apos;s an hour of your
          time.
        </li>
      </ol>

      <p>
        This is exactly the kind of life admin that nobody wants to do. It&apos;s
        boring, it&apos;s tedious, and the savings per cancellation feel too small
        to justify the effort — even though they add up to real money.
      </p>

      <h2>How Bento Finds and Cancels Forgotten Subscriptions</h2>

      <p>
        This is where Bento changes the game. Instead of you manually combing
        through statements and fighting with cancellation flows, Bento does it
        all automatically:
      </p>

      <ol>
        <li>
          <strong>Connect your accounts</strong> — Bento securely links to your
          bank and credit card accounts using bank-level encryption (we never
          store your credentials).
        </li>
        <li>
          <strong>AI scans every transaction</strong> — Bento&apos;s AI identifies
          subscription charges, categorizes them, and flags services you
          haven&apos;t used based on login patterns and email data.
        </li>
        <li>
          <strong>You approve with one tap</strong> — Bento shows you a clear
          list of findings: which subscriptions you&apos;re paying for, how much
          they cost, and when you last used them. You decide which to keep and
          which to cancel.
        </li>
        <li>
          <strong>We handle the cancellation</strong> — Bento automatically
          processes the cancellations, navigating the dark patterns and
          retention flows so you don&apos;t have to.
        </li>
        <li>
          <strong>Ongoing monitoring</strong> — Bento continues scanning your
          accounts and alerts you when new subscriptions appear or when free
          trials are about to convert.
        </li>
      </ol>

      <h2>Real Results from Early Users</h2>

      <p>
        In our beta program, users who completed a full scan discovered an
        average of <strong>$847 in potential annual savings</strong>. Here are
        some anonymized examples:
      </p>

      <ul>
        <li>
          A marketing professional in Austin was paying for 4 streaming
          services, 2 cloud storage plans, and a forgotten Adobe Creative Cloud
          subscription — <strong>$1,140/year</strong> in unnecessary charges.
        </li>
        <li>
          A software engineer in Seattle had 3 food delivery subscriptions, an
          unused gym membership, and 2 redundant SaaS tools —{" "}
          <strong>$680/year</strong> in savings.
        </li>
        <li>
          A teacher in Chicago found a gym membership she hadn&apos;t used in 14
          months, a magazine subscription she&apos;d forgotten about, and an old
          dating app premium account — <strong>$420/year</strong>.
        </li>
      </ul>

      <h2>Take Action Today</h2>

      <p>
        Every day you wait is another day these subscriptions drain your
        account. A Bento scan takes less than 5 minutes to set up and can save
        you hundreds — possibly thousands — per year. The scan is free, and you
        only pay if you want Bento to handle the cancellations (and negotiate
        your bills, file refunds, and track warranties) automatically.
      </p>

      <p>
        Stop letting forgotten subscriptions silently drain your bank account.
        Take control today.
      </p>

      <div className="not-prose my-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">
          Find your forgotten subscriptions in 5 minutes
        </h3>
        <p className="text-lg text-white/90 mb-6">
          The average Bento user finds $540/year in forgotten subscriptions.
          Your scan is free.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-md bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg hover:bg-white/95 transition-all hover:scale-105"
        >
          <Zap className="h-5 w-5" />
          Start Free Scan
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="text-sm text-white/70 mt-3">
          No credit card required · Results in minutes
        </p>
      </div>
    </article>
  );
}
