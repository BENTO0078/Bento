import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/referral/apply
 * Apply a referral code on signup completion.
 * Body: { referralCode: string }
 *
 * Looks up the referrer by referral_code, creates a referrals row,
 * and updates the new user's referred_by on their profile.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let referralCode: string | undefined;
  try {
    const body = await request.json();
    referralCode = body.referralCode;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!referralCode || typeof referralCode !== "string" || referralCode.length === 0) {
    return NextResponse.json(
      { error: "referralCode is required" },
      { status: 400 }
    );
  }

  // Look up the referrer by referral code
  const { data: referrer, error: lookupError } = await supabase
    .from("profiles")
    .select("id, referral_code")
    .eq("referral_code", referralCode.toUpperCase().trim())
    .single();

  if (lookupError || !referrer) {
    return NextResponse.json(
      { error: "Invalid referral code" },
      { status: 404 }
    );
  }

  // Prevent self-referral
  if (referrer.id === user.id) {
    return NextResponse.json(
      { error: "Cannot refer yourself" },
      { status: 400 }
    );
  }

  // Check if user was already referred
  const { data: existingRef } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_user_id", user.id)
    .maybeSingle();

  if (existingRef) {
    return NextResponse.json(
      { error: "Already referred", alreadyReferred: true },
      { status: 200 }
    );
  }

  // Create the referral row
  const { data: referral, error: insertError } = await supabase
    .from("referrals")
    .insert({
      referrer_id: referrer.id,
      referred_email: user.email ?? undefined,
      referred_user_id: user.id,
      referral_code: referralCode.toUpperCase().trim(),
      status: "signed_up",
      reward_cents: 0,
      reward_type: "months_free",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to create referral:", insertError);
    return NextResponse.json(
      { error: "Failed to record referral" },
      { status: 500 }
    );
  }

  // Update the new user's profile with referred_by
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ referred_by: referrer.id })
    .eq("id", user.id);

  if (updateError) {
    console.error("Failed to update referred_by:", updateError);
    // Non-fatal — the referral row exists
  }

  // Update the user's total_savings — add a small credit for referring someone
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("total_savings")
    .eq("id", referrer.id)
    .single();
  const currentSavings = currentProfile?.total_savings ?? 0;
  await supabase
    .from("profiles")
    .update({ total_savings: currentSavings + 100 })
    .eq("id", referrer.id);

  return NextResponse.json({
    success: true,
    referralId: referral.id,
    message: "Referral applied successfully",
  });
}
