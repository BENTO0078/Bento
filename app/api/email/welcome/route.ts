import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/services/email-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/email/welcome
 *
 * Triggers a welcome email for the authenticated user.
 * Called after signup completes. Auth required.
 *
 * Body (optional): { name?: string }
 * If name is not provided, it's read from the user's profile.
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "User has no email address" },
        { status: 400 }
      );
    }

    // Try to read name from body, fall back to profile
    let name = "there";
    try {
      const body = await request.json();
      if (body.name) {
        name = body.name;
      }
    } catch {
      // No body or invalid JSON — fall through to profile lookup
    }

    if (name === "there") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        name = profile.full_name;
      }
    }

    // Fire-and-forget — don't block the response on email delivery
    sendWelcomeEmail(user.email, name).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
