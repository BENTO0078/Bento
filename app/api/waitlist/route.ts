import { NextRequest, NextResponse } from "next/server";
import { createUntypedAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = createUntypedAdminClient();

    const { error } = await supabase.from("waitlist").insert({
      email: email.trim().toLowerCase(),
      source: "calculator",
    });

    if (error) {
      // If duplicate email, still return success (don't leak that it exists)
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already on the list" });
      }
      console.error("[waitlist] insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Added to waitlist" });
  } catch (err) {
    console.error("[waitlist] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
