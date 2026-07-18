"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AutomationLogsTable,
  type AutomationLogEntry,
} from "@/components/admin/automation-logs-table";
import { Badge } from "@/components/ui/badge";

interface AutomationStats {
  total: number;
  completed: number;
  failed: number;
  successRate: number;
}

export default function AdminAutomationsPage() {
  const [logs, setLogs] = useState<AutomationLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AutomationStats>({
    total: 0,
    completed: 0,
    failed: 0,
    successRate: 0,
  });
  const limit = 50;

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);

    const res = await fetch(`/api/admin/automations?${params.toString()}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setTotalCount(data.total || 0);
    setStats(data.stats || { total: 0, completed: 0, failed: 0, successRate: 0 });
    setIsLoading(false);
  }, [page, searchQuery, typeFilter, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const successRateColor =
    stats.successRate >= 95
      ? "text-emerald-400"
      : stats.successRate >= 80
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">
          Automation Monitor
        </h1>
        <p className="text-gray-400 mt-1">
          Track all AI automations, success rates, and errors.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="text-xs font-medium text-gray-500">Total Runs</div>
          <div className="mt-1 text-2xl font-bold text-gray-200">
            {stats.total.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-emerald-800/30 bg-gray-900/50 p-4">
          <div className="text-xs font-medium text-emerald-500">Completed</div>
          <div className="mt-1 text-2xl font-bold text-emerald-400">
            {stats.completed.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-red-800/30 bg-gray-900/50 p-4">
          <div className="text-xs font-medium text-red-500">Failed</div>
          <div className="mt-1 text-2xl font-bold text-red-400">
            {stats.failed.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="text-xs font-medium text-gray-500">Success Rate</div>
          <div className={`mt-1 text-2xl font-bold ${successRateColor}`}>
            {stats.successRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <AutomationLogsTable
        logs={logs}
        totalCount={totalCount}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSearch={setSearchQuery}
        onTypeFilter={setTypeFilter}
        onStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        isLoading={isLoading}
      />
    </div>
  );
}
