import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createUntypedAdminClient } from "@/lib/supabase/admin";
import { getResend, EMAIL_FROM } from "@/lib/email/client";
import { welcomeTemplate } from "@/lib/email/templates";

export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://bento.app";

/**
 * POST /api/email/test
 *
 * Sends a test email to the authenticated admin user.
 * Useful for verifying email configuration (Resend API key, DNS records, etc.).
 * Admin-only: user must have is_admin = true on their profile.
 */
export async function POST(_request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin status
    const admin = createUntypedAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("is_admin, full_name, email")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const email = user.email || profile?.email;
    if (!email) {
      return NextResponse.json(
        { error: "No email address found for user" },
        { status: 400 }
      );
    }

    const resend = getResend();
    const name = profile?.full_name || "Admin";
    const { subject, html } = welcomeTemplate({
      name,
      appUrl: APP_URL,
    });

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `[TEST] ${subject}`,
      html,
    });

    if (result.error) {
      console.error("Test email error:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error.message || "Failed to send test email",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      resendId: result.data?.id,
    });
  } catch (error) {
    console.error("Test email route error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
