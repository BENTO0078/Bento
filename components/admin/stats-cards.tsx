"use client";

import { Users, DollarSign, CreditCard, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  totalUsers: number;
  paidUsers: number;
  mrr: number;
  totalSavings: number;
  isLoading?: boolean;
}

export function StatsCards({
  totalUsers,
  paidUsers,
  mrr,
  totalSavings,
  isLoading,
}: StatsCardsProps) {
  const stats = [
    {
      name: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      name: "Paid Users",
      value: paidUsers.toLocaleString(),
      icon: CreditCard,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      name: "MRR",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(mrr),
      icon: DollarSign,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      name: "Total Savings Found",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(totalSavings),
      icon: PiggyBank,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 animate-pulse"
          >
            <div className="h-4 w-24 bg-gray-800 rounded mb-3" />
            <div className="h-8 w-32 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className={cn(
              "rounded-lg border bg-gray-900/50 p-6",
              stat.border
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">
                {stat.name}
              </span>
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-100">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
