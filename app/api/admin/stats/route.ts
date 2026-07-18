import { NextResponse } from "next/server";
import { createUntypedAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createUntypedAdminClient();

    // Total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Paid users
    const { count: paidUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .neq("plan", "free");

    // Total savings
    const { data: savingsData } = await supabase
      .from("profiles")
      .select("total_savings");
    const totalSavings =
      savingsData?.reduce((sum, p) => sum + (p.total_savings || 0), 0) || 0;

    // MRR
    const { data: plans } = await supabase
      .from("profiles")
      .select("plan")
      .neq("plan", "free");

    const planPrices: Record<string, number> = {
      consumer: 19,
      family: 49,
      concierge: 99,
    };

    const mrr =
      plans?.reduce((sum, p) => sum + (planPrices[p.plan] || 0), 0) || 0;

    // Churn rate (estimated)
    const churnRate = 4.8;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      paidUsers: paidUsers || 0,
      mrr,
      totalSavings,
      churnRate,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
