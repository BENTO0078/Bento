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
    const plan = searchParams.get("plan") || "";
    const onboarding = searchParams.get("onboarding") || "";

    let query = supabase
      .from("profiles")
      .select(
        "id, email, full_name, plan, onboarding_completed, total_savings, created_at, is_admin",
        { count: "exact" }
      );

    // Filters
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,full_name.ilike.%${search}%`
      );
    }
    if (plan) {
      query = query.eq("plan", plan);
    }
    if (onboarding === "completed") {
      query = query.eq("onboarding_completed", true);
    } else if (onboarding === "pending") {
      query = query.eq("onboarding_completed", false);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: users, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Admin users query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: users || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
