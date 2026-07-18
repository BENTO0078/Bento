import { NextResponse } from "next/server";
import { createUntypedAdminClient } from "@/lib/supabase/admin";
import { sendWeeklySummary } from "@/lib/services/email-service";
import type { SavingsEvent } from "@/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/email/digest
 *
 * Weekly digest endpoint — designed to be called by Vercel Cron or an
 * external scheduler (e.g. cron-job.org, GitHub Actions).
 *
 * Protected with a CRON_SECRET header that must match the environment variable.
 *
 * Logic:
 *  1. Find all active (onboarded) users with email addresses.
 *  2. For each user, find savings events created in the last 7 days.
 *  3. If the user has new activity, send them a weekly summary.
 *
 * Rate-limited by design: processes users in sequence with small delays
 * to avoid overwhelming Resend's API rate limits.
 */
export async function POST(request: Request) {
  // Auth check — require a shared secret
  const secret = request.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createUntypedAdminClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    // Fetch all onboarded users with emails
    // Paginate to handle large user bases safely
    const pageSize = 100;
    let page = 0;
    let totalSent = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    while (true) {
      const { data: profiles, error: profileError } = await admin
        .from("profiles")
        .select("id, email, full_name, total_savings")
        .eq("onboarding_completed", true)
        .not("email", "is", null)
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (profileError) {
        console.error("Digest: failed to fetch profiles:", profileError);
        return NextResponse.json(
          { error: "Failed to fetch users" },
          { status: 500 }
        );
      }

      if (!profiles || profiles.length === 0) {
        break; // No more users
      }

      for (const profile of profiles) {
        if (!profile.email) continue;

        try {
          // Find savings events from the last 7 days
          const { data: events, error: eventError } = await admin
            .from("savings_events")
            .select("*")
            .eq("profile_id", profile.id)
            .gte("created_at", sevenDaysAgo)
            .order("created_at", { ascending: false })
            .limit(20);

          if (eventError) {
            console.error(
              `Digest: failed to fetch events for ${profile.id}:`,
              eventError
            );
            totalErrors++;
            continue;
          }

          const typedEvents = (events || []) as unknown as SavingsEvent[];

          if (typedEvents.length === 0) {
            totalSkipped++;
            continue; // No new activity — skip
          }

          // Calculate weekly savings
          const weeklySavings = typedEvents.reduce(
            (sum, e) => sum + (e.amount_cents || 0),
            0
          );

          // Score is based on total_savings (divide by 100 to get approximate score)
          const score = Math.floor((profile.total_savings || 0) / 100);

          // Send the email
          await sendWeeklySummary(
            profile.email,
            profile.full_name || "there",
            weeklySavings,
            score,
            typedEvents
          );

          totalSent++;

          // Small delay between sends to respect Resend rate limits
          // (Resend free tier: 100/day, Pro: 1000/hr — we're conservative)
          if (totalSent % 10 === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (err) {
          console.error(`Digest: error processing user ${profile.id}:`, err);
          totalErrors++;
        }
      }

      page++;
    }

    return NextResponse.json({
      success: true,
      totalSent,
      totalSkipped,
      totalErrors,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Digest route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
