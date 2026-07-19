import { createUntypedAdminClient } from "@/lib/supabase/admin";
import { BarChart3, Globe, MousePointerClick, Users, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface AnalyticsData {
  todayPageviews: number;
  todayUniqueIps: number;
  topPages: { path: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  recentPageviews: {
    id: string;
    path: string;
    referrer: string | null;
    created_at: string;
  }[];
}

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = createUntypedAdminClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Today's pageviews
  const { count: todayPageviews } = await supabase
    .from("analytics_pageviews")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString());

  // Unique IPs today (via distinct select, then count)
  const { data: uniqueIps } = await supabase
    .from("analytics_pageviews")
    .select("ip_hash")
    .gte("created_at", todayStart.toISOString())
    .not("ip_hash", "is", null);

  const distinctIps = new Set(
    (uniqueIps ?? []).map((r: { ip_hash: string }) => r.ip_hash)
  );

  // Top 5 pages (all time)
  const { data: topPages } = await supabase.rpc("get_top_pages", { n: 5 });

  // Top 5 referrers (all time)
  const { data: topReferrers } = await supabase.rpc("get_top_referrers", { n: 5 });

  // Last 50 pageviews
  const { data: recentPageviews } = await supabase
    .from("analytics_pageviews")
    .select("id, path, referrer, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return {
    todayPageviews: todayPageviews ?? 0,
    todayUniqueIps: distinctIps.size,
    topPages: (topPages ?? []) as { path: string; count: number }[],
    topReferrers: (topReferrers ?? []) as { referrer: string; count: number }[],
    recentPageviews: (recentPageviews ?? []) as {
      id: string;
      path: string;
      referrer: string | null;
      created_at: string;
    }[],
  };
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatReferrer(ref: string | null): string {
  if (!ref) return "Direct / None";
  try {
    const url = new URL(ref);
    return url.hostname;
  } catch {
    return ref.length > 40 ? ref.slice(0, 40) + "…" : ref;
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  const hasData = data.todayPageviews > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Server-side pageview tracking — no client scripts, no cookies, no
            GDPR issues.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card py-20 px-4">
          <div className="rounded-full bg-muted p-4 mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Waiting for visitors</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Data will appear here as people browse the site. Pageviews are logged
            server-side on every non-API, non-static request — no setup required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Server-side pageview tracking — no client scripts, no cookies, no GDPR
          issues.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Today&apos;s Pageviews
            </span>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data.todayPageviews.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Unique Visitors Today
            </span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data.todayUniqueIps.toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Tracked Pages (All Time)
            </span>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data.topPages.length.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            unique paths
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Referrers (All Time)
            </span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold">
            {data.topReferrers.length.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            unique sources
          </p>
        </div>
      </div>

      {/* Top pages + Top referrers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-sm">Top Pages</h2>
          </div>
          <div className="divide-y">
            {data.topPages.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                No data yet.
              </p>
            ) : (
              data.topPages.map((page, i) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground w-5">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">
                    {page.count.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top referrers */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-sm">Top Referrers</h2>
          </div>
          <div className="divide-y">
            {data.topReferrers.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                No external referrers yet.
              </p>
            ) : (
              data.topReferrers.map((ref, i) => (
                <div
                  key={ref.referrer}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground w-5">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {formatReferrer(ref.referrer)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground flex-shrink-0 ml-2">
                    {ref.count.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent pageviews table */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-sm">
            Recent Pageviews{" "}
            <span className="text-muted-foreground font-normal">
              (last 50)
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-2.5 text-left font-medium text-muted-foreground">
                  Path
                </th>
                <th className="px-5 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">
                  Referrer
                </th>
                <th className="px-5 py-2.5 text-right font-medium text-muted-foreground">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.recentPageviews.map((pv) => (
                <tr key={pv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-2.5 font-medium">{pv.path}</td>
                  <td className="px-5 py-2.5 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">
                    {formatReferrer(pv.referrer)}
                  </td>
                  <td className="px-5 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                    {formatTime(pv.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
