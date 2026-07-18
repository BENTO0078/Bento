import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * checkout.session.completed — set profile plan & stripe_customer_id
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const profileId = session.metadata?.profile_id;
  if (!profileId) {
    console.error("No profile_id in checkout session metadata");
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  // Determine plan from the subscription
  let plan: string | null = null;
  if (session.subscription && typeof session.subscription === "string") {
    try {
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription,
        { expand: ["items.data.price.product"] }
      );
      plan = getPlanFromSubscription(subscription);
    } catch (err) {
      console.error("Failed to retrieve subscription for plan detection:", err);
    }
  }

  const updates: Record<string, unknown> = {};
  if (customerId) {
    updates.stripe_customer_id = customerId;
  }
  if (plan) {
    updates.plan = plan;
  }

  if (Object.keys(updates).length === 0) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", profileId);

  if (error) {
    console.error("Failed to update profile after checkout:", error);
  } else {
    console.log(
      `Checkout completed for profile ${profileId}: plan=${plan}, customer=${customerId}`
    );
  }
}

/**
 * customer.subscription.updated — sync plan changes
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) {
    console.error("No customer ID on subscription update");
    return;
  }

  const plan = getPlanFromSubscription(subscription);
  if (!plan) {
    console.error("Could not determine plan from subscription:", subscription.id);
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ plan })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Failed to update profile plan from subscription update:", error);
  } else {
    console.log(`Subscription updated: customer=${customerId}, plan=${plan}`);
  }
}

/**
 * customer.subscription.deleted — downgrade to free tier
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  if (!customerId) {
    console.error("No customer ID on subscription deletion");
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ plan: "free" })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Failed to downgrade profile to free:", error);
  } else {
    console.log(`Subscription deleted: customer=${customerId}, downgraded to free`);
  }
}

/**
 * invoice.paid — log for analytics
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  console.log(
    `Invoice paid: customer=${customerId}, amount=${invoice.amount_paid}, invoice=${invoice.id}`
  );
}

/**
 * invoice.payment_failed — flag account, log
 */
async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  console.warn(
    `Invoice payment failed: customer=${customerId}, amount=${invoice.amount_due}, invoice=${invoice.id}, next_payment_attempt=${invoice.next_payment_attempt}`
  );

  // Flag the profile as having a payment issue if we can find it
  if (customerId) {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ plan: "free" })
      .eq("stripe_customer_id", customerId);

    if (error) {
      console.error("Failed to flag profile after payment failure:", error);
    }
  }
}

/**
 * Derives the Bento plan name from a Stripe Subscription object
 * by inspecting line-item price metadata or product name.
 */
function getPlanFromSubscription(
  subscription: Stripe.Subscription
): string | null {
  // Check items for plan info
  const items = subscription.items?.data;
  if (!items || items.length === 0) return null;

  for (const item of items) {
    const product = item.price?.product;
    if (!product) continue;

    const productName =
      typeof product === "string"
        ? ""
        : (product as Stripe.Product).name?.toLowerCase() ?? "";

    const priceLookupKey = item.price?.lookup_key?.toLowerCase() ?? "";

    // Detect plan from product name or price lookup key
    if (
      productName.includes("concierge") ||
      priceLookupKey.includes("concierge")
    ) {
      return "concierge";
    }
    if (productName.includes("family") || priceLookupKey.includes("family")) {
      return "family";
    }
    if (
      productName.includes("consumer") ||
      priceLookupKey.includes("consumer")
    ) {
      return "consumer";
    }
  }

  return null;
}
