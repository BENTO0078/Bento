import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type FindingInput = {
  id: string;
  serviceName: string;
  type: "cancel" | "negotiate" | "refund" | "warranty" | "switch";
  costCents: number;
  savingsCents: number;
  category: string;
};

function getServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const findings: FindingInput[] = body.findings || [];

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = user.id;
    const admin = getServiceClient();
    const now = new Date().toISOString();

    // Process each finding
    for (const finding of findings) {
      switch (finding.type) {
        case "cancel": {
          const { data: sub } = await admin
            .from("subscriptions")
            .insert({
              profile_id: profileId,
              service_name: finding.serviceName,
              amount_cents: finding.costCents,
              billing_cycle: "monthly",
              category: mapCategory(finding.category),
              status: "active",
              detected_by: "ai",
              is_user_confirmed: false,
              savings_cents: finding.savingsCents,
              negotiation_status: "none",
            })
            .select("id")
            .single();

          await admin.from("savings_events").insert({
            profile_id: profileId,
            event_type: "subscription_cancelled",
            title: `${finding.serviceName} — ready to cancel`,
            description: `We detected you haven't used ${finding.serviceName} recently. Cancel to save ${formatCents(finding.savingsCents)}/year.`,
            amount_cents: finding.savingsCents,
            source_type: "subscriptions",
            source_id: sub?.id || null,
          });
          break;
        }

        case "negotiate": {
          const { data: bill } = await admin
            .from("bills")
            .insert({
              profile_id: profileId,
              bill_name: finding.serviceName,
              amount_cents: finding.costCents,
              billing_cycle: "monthly",
              category: "telecom",
              status: "active",
              negotiation_eligible: true,
              negotiation_status: "none",
              savings_cents: finding.savingsCents,
            })
            .select("id")
            .single();

          await admin.from("savings_events").insert({
            profile_id: profileId,
            event_type: "bill_negotiated",
            title: `${finding.serviceName} — negotiation opportunity`,
            description: `Market rates for ${finding.serviceName} are lower. Potential savings: ${formatCents(finding.savingsCents)}/year.`,
            amount_cents: finding.savingsCents,
            source_type: "bills",
            source_id: bill?.id || null,
          });
          break;
        }

        case "refund": {
          const { data: ref } = await admin
            .from("refunds")
            .insert({
              profile_id: profileId,
              merchant_name: finding.serviceName,
              refund_amount_cents: finding.savingsCents,
              reason: "price_drop",
              status: "pending",
              confidence: 92,
              requires_action: true,
              action_description: `Price drops detected on recent purchases. File a claim for ${formatCents(finding.savingsCents)} in refunds.`,
            })
            .select("id")
            .single();

          await admin.from("savings_events").insert({
            profile_id: profileId,
            event_type: "refund_found",
            title: `${finding.serviceName} — refund available`,
            description: `We detected price drops on your recent ${finding.serviceName} purchases. ${formatCents(finding.savingsCents)} in refunds available.`,
            amount_cents: finding.savingsCents,
            source_type: "refunds",
            source_id: ref?.id || null,
          });
          break;
        }

        case "switch": {
          const { data: bill } = await admin
            .from("bills")
            .insert({
              profile_id: profileId,
              bill_name: finding.serviceName,
              amount_cents: finding.costCents,
              billing_cycle: "monthly",
              category: "insurance",
              status: "active",
              negotiation_eligible: true,
              negotiation_status: "none",
              savings_cents: finding.savingsCents,
            })
            .select("id")
            .single();

          await admin.from("savings_events").insert({
            profile_id: profileId,
            event_type: "bill_negotiated",
            title: `${finding.serviceName} — switch and save`,
            description: `Competitor rates are significantly lower. Switch to save approximately ${formatCents(finding.savingsCents)}/year.`,
            amount_cents: finding.savingsCents,
            source_type: "bills",
            source_id: bill?.id || null,
          });
          break;
        }

        case "warranty": {
          const { data: warr } = await admin
            .from("warranties")
            .insert({
              profile_id: profileId,
              product_name: finding.serviceName,
              status: "expiring_soon",
              category: "electronics",
            })
            .select("id")
            .single();

          await admin.from("savings_events").insert({
            profile_id: profileId,
            event_type: "warranty_claim",
            title: `${finding.serviceName} — warranty expiring soon`,
            description: `Your ${finding.serviceName} warranty expires in 15 days. Check if you're eligible for a repair or replacement before it's too late.`,
            amount_cents: 0,
            source_type: "price_alerts",
            source_id: warr?.id || null,
          });
          break;
        }
      }
    }

    // Add Amazon Prime subscription if Amazon was found
    const hasAmazon = findings.some((f) => f.id === "amazon");
    if (hasAmazon) {
      await admin.from("subscriptions").insert({
        profile_id: profileId,
        service_name: "Amazon Prime",
        amount_cents: 1499,
        billing_cycle: "monthly",
        category: "entertainment",
        status: "active",
        detected_by: "ai",
        is_user_confirmed: false,
        savings_cents: 0,
        negotiation_status: "none",
      });
    }

    // Calculate total savings and update profile
    const totalSavingsCents = findings.reduce(
      (sum, f) => sum + f.savingsCents,
      0
    );

    await admin
      .from("profiles")
      .update({
        onboarding_completed: true,
        total_savings: totalSavingsCents,
      })
      .eq("id", profileId);

    // Log automation
    await admin.from("automation_logs").insert({
      profile_id: profileId,
      automation_type: "subscription_detect",
      status: "completed",
      result_summary: `Onboarding scan completed. Found ${findings.length} savings opportunities totaling ${formatCents(totalSavingsCents)}.`,
      savings_cents: totalSavingsCents,
      metadata: {
        findings_count: findings.length,
        findings: findings.map((f) => ({
          id: f.id,
          type: f.type,
          savings: f.savingsCents,
        })),
      },
      completed_at: now,
    });

    return NextResponse.json({
      success: true,
      savingsFound: totalSavingsCents,
      findingsCount: findings.length,
    });
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

function mapCategory(
  category: string
): "entertainment" | "software" | "fitness" | "news" | "cloud" | "other" {
  const lower = category.toLowerCase();
  if (lower.includes("entertain")) return "entertainment";
  if (lower.includes("fitness") || lower.includes("gym")) return "fitness";
  if (lower.includes("software") || lower.includes("app")) return "software";
  if (lower.includes("news") || lower.includes("magazine")) return "news";
  if (lower.includes("cloud") || lower.includes("storage")) return "cloud";
  return "other";
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
