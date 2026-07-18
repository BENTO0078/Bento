import { NextRequest, NextResponse } from "next/server";
import { createUntypedAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = createUntypedAdminClient();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    // Build query
    let query = supabase
      .from("automation_logs")
      .select(
        "id, profile_id, automation_type, status, result_summary, savings_cents, error_message, created_at, completed_at",
        { count: "exact" }
      );

    if (type) {
      query = query.eq("automation_type", type);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: logs, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Admin automations query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch automation logs" },
        { status: 500 }
      );
    }

    // Fetch user emails for the logs
    const profileIdSet = new Set<string>();
    (logs || []).forEach((l: any) => {
      if (l.profile_id) profileIdSet.add(l.profile_id);
    });
    const profileIds = Array.from(profileIdSet);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", profileIds);

    const emailMap = new Map<string, string>();
    profiles?.forEach((p) => {
      emailMap.set(p.id, p.email || "");
    });

    const enrichedLogs = (logs || []).map((log: any) => ({
      id: log.id,
      profile_id: log.profile_id,
      automation_type: log.automation_type,
      status: log.status,
      result_summary: log.result_summary,
      savings_cents: log.savings_cents,
      error_message: log.error_message,
      created_at: log.created_at,
      completed_at: log.completed_at,
      user_email: emailMap.get(log.profile_id) || null,
    }));

    // Stats
    const { count: totalLogs } = await supabase
      .from("automation_logs")
      .select("*", { count: "exact", head: true });

    const { count: completedLogs } = await supabase
      .from("automation_logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    const { count: failedLogs } = await supabase
      .from("automation_logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed");

    const total = totalLogs || 0;
    const completed = completedLogs || 0;
    const failed = failedLogs || 0;
    const successRate = total > 0 ? ((completed / total) * 100) : 100;

    return NextResponse.json({
      logs: enrichedLogs,
      total: count || 0,
      page,
      limit,
      stats: {
        total,
        completed,
        failed,
        successRate,
      },
    });
  } catch (error) {
    console.error("Admin automations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch automation logs" },
      { status: 500 }
    );
  }
}
