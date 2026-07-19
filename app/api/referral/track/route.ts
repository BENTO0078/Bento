import { NextRequest, NextResponse } from "next/server";
import { createUntypedAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrer_email } = body;

    if (!referrer_email || typeof referrer_email !== "string") {
      return NextResponse.json(
        { error: "referrer_email is required" },
        { status: 400 }
      );
    }

    const supabase = createUntypedAdminClient();

    const { error } = await supabase.from("referrals").insert({
      referrer_email: referrer_email.trim().toLowerCase(),
      status: "pending",
    });

    if (error) {
      console.error("[referral] track error:", error.message);
      return NextResponse.json(
        { error: "Failed to track referral" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[referral] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
