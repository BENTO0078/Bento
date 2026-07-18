"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

const PLAN_COLORS: Record<string, string> = {
  consumer: "#3b82f6",
  family: "#8b5cf6",
  concierge: "#f59e0b",
  free: "#6b7280",
};

interface DailySignupData {
  date: string;
  count: number;
}

interface PlanDistributionData {
  name: string;
  value: number;
}

interface MRRGrowthData {
  date: string;
  mrr: number;
}

interface RevenueChartProps {
  signupData: DailySignupData[];
  planDistribution: PlanDistributionData[];
  mrrGrowth: MRRGrowthData[];
  isLoading?: boolean;
}

export function RevenueChart({
  signupData,
  planDistribution,
  mrrGrowth,
  isLoading,
}: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 animate-pulse"
          >
            <div className="h-5 w-32 bg-gray-800 rounded mb-6" />
            <div className="h-64 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* User Signups */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">
          Signups (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={signupData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(v) => {
                const d = new Date(v);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
              labelFormatter={(v) => new Date(v).toLocaleDateString()}
            />
            <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Plan Distribution */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">
          Plan Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={planDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {planDistribution.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={PLAN_COLORS[entry.name] || "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-gray-400 text-sm capitalize">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* MRR Growth */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 lg:col-span-2">
        <h2 className="text-sm font-medium text-gray-300 mb-4">
          MRR Growth
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mrrGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(v) => {
                const d = new Date(v);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
              formatter={(value: any) => [`${Number(value).toLocaleString()}`, "MRR"]}
            />
            <Line
              type="monotone"
              dataKey="mrr"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
