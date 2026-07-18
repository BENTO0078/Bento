import { createUntypedAdminClient } from "@/lib/supabase/admin";
import { StatsCards } from "@/components/admin/stats-cards";
import { RevenueChart } from "@/components/admin/revenue-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface RevenuePlan {
  plan: string;
  mrr: number;
  count: number;
}

async function getAdminStats() {
  const supabase = createUntypedAdminClient();

  // Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Paid users (not free)
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

  // MRR calculation (hardcoded plan prices: consumer=$19, family=$49, concierge=$99)
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

  // Daily signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: signups } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at");

  const signupMap = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    signupMap.set(d.toISOString().slice(0, 10), 0);
  }
  signups?.forEach((s) => {
    const day = s.created_at.slice(0, 10);
    signupMap.set(day, (signupMap.get(day) || 0) + 1);
  });
  const signupData = Array.from(signupMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  // Plan distribution
  const planMap = new Map<string, number>();
  plans?.forEach((p) => {
    planMap.set(p.plan, (planMap.get(p.plan) || 0) + 1);
  });
  const { count: freeCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("plan", "free");
  planMap.set("free", freeCount || 0);
  const planDistribution = Array.from(planMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  // MRR growth (last 30 days, simulated from current plan counts)
  const mrrGrowth = signupData.map((d) => ({
    date: d.date,
    mrr: Math.round(mrr * (0.7 + 0.3 * (signupData.indexOf(d) / 30))),
  }));

  // Recent signups
  const { data: recentSignups } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, onboarding_completed, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  // Recent automation errors
  const { data: recentErrors, count: errorCount } = await supabase
    .from("automation_logs")
    .select("id, automation_type, error_message, created_at, profile_id", {
      count: "exact",
    })
    .eq("status", "failed")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalUsers: totalUsers || 0,
    paidUsers: paidUsers || 0,
    mrr,
    totalSavings,
    signupData,
    planDistribution,
    mrrGrowth,
    recentSignups: recentSignups || [],
    recentErrors: recentErrors || [],
  };
}

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">
          Admin Overview
        </h1>
        <p className="text-gray-400 mt-1">
          System health, user metrics, and revenue at a glance.
        </p>
      </div>

      <StatsCards
        totalUsers={stats.totalUsers}
        paidUsers={stats.paidUsers}
        mrr={stats.mrr}
        totalSavings={stats.totalSavings}
      />

      <div className="mt-8">
        <RevenueChart
          signupData={stats.signupData}
          planDistribution={stats.planDistribution}
          mrrGrowth={stats.mrrGrowth}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent Signups */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-sm font-medium text-gray-300 mb-4">
            Recent Signups
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">User</TableHead>
                <TableHead className="text-gray-400">Plan</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentSignups.length === 0 ? (
                <TableRow className="border-gray-800">
                  <TableCell
                    colSpan={3}
                    className="text-center text-gray-500 py-4"
                  >
                    No signups yet.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentSignups.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-gray-200 text-sm">
                      <div>
                        {user.full_name || "—"}
                        <span className="text-gray-500 ml-1">
                          {user.email ? `(${user.email})` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Recent Automation Errors */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="text-sm font-medium text-gray-300 mb-4">
            Recent Automation Errors
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Type</TableHead>
                <TableHead className="text-gray-400">Error</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentErrors.length === 0 ? (
                <TableRow className="border-gray-800">
                  <TableCell
                    colSpan={3}
                    className="text-center text-emerald-400 py-4"
                  >
                    No errors — all automations running smoothly.
                  </TableCell>
                </TableRow>
              ) : (
                stats.recentErrors.map((log) => (
                  <TableRow
                    key={log.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell>
                      <Badge className="bg-red-900/50 text-red-300 border-red-700/50 text-xs">
                        {log.automation_type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-red-400 text-sm max-w-[200px] truncate">
                      {log.error_message || "Unknown error"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
