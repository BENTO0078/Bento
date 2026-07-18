// ============================================================
// Bento — Stripe Price IDs
// Replace these placeholder values with real Stripe Price IDs
// after creating Products & Prices in the Stripe Dashboard.
// ============================================================

export const CONSUMER_MONTHLY_PRICE_ID =
  "price_1TucjOQ0hLs5tAnr48wrPSz9";
export const CONSUMER_ANNUAL_PRICE_ID =
  "price_placeholder_consumer_annual";
export const FAMILY_MONTHLY_PRICE_ID =
  "price_1TucjOQ0hLs5tAnr2rr3TvGY";
export const FAMILY_ANNUAL_PRICE_ID =
  "price_placeholder_family_annual";
export const CONCIERGE_MONTHLY_PRICE_ID =
  "price_1TucjOQ0hLs5tAnr3s8kwLZu";

export type BentoPlan = "consumer" | "family" | "concierge";
export type BillingCycle = "monthly" | "annual";

const PRICE_MAP: Record<string, Record<BillingCycle, string>> = {
  consumer: {
    monthly: CONSUMER_MONTHLY_PRICE_ID,
    annual: CONSUMER_ANNUAL_PRICE_ID,
  },
  family: {
    monthly: FAMILY_MONTHLY_PRICE_ID,
    annual: FAMILY_ANNUAL_PRICE_ID,
  },
  concierge: {
    monthly: CONCIERGE_MONTHLY_PRICE_ID,
    annual: "",
  },
};

/**
 * Returns the Stripe Price ID for a given plan and billing cycle.
 * Concierge is monthly-only — annual returns empty string.
 */
export function getPriceId(
  plan: BentoPlan,
  billingCycle: BillingCycle
): string {
  return PRICE_MAP[plan]?.[billingCycle] ?? "";
}

/** Human-readable plan metadata for UI display. */
export const PLAN_META: Record<string, { name: string; monthlyPrice: number }> = {
  consumer: { name: "Consumer", monthlyPrice: 19 },
  family: { name: "Family", monthlyPrice: 49 },
  concierge: { name: "Concierge", monthlyPrice: 99 },
};
