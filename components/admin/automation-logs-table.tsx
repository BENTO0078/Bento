"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export interface AutomationLogEntry {
  id: string;
  profile_id: string;
  user_email: string | null;
  automation_type: string;
  status: string;
  result_summary: string | null;
  savings_cents: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

interface AutomationLogsTableProps {
  logs: AutomationLogEntry[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onTypeFilter: (type: string) => void;
  onStatusFilter: (status: string) => void;
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
  isLoading?: boolean;
}

const typeLabels: Record<string, string> = {
  subscription_detect: "Sub Detect",
  bill_negotiate: "Bill Negotiate",
  refund_find: "Refund Find",
  price_monitor: "Price Monitor",
  warranty_track: "Warranty Track",
};

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
  failed: "bg-red-900/50 text-red-300 border-red-700/50",
  started: "bg-blue-900/50 text-blue-300 border-blue-700/50",
  in_progress: "bg-amber-900/50 text-amber-300 border-amber-700/50",
  needs_review: "bg-purple-900/50 text-purple-300 border-purple-700/50",
};

export function AutomationLogsTable({
  logs,
  totalCount,
  page,
  limit,
  onPageChange,
  onSearch,
  onTypeFilter,
  onStatusFilter,
  searchQuery,
  typeFilter,
  statusFilter,
  isLoading,
}: AutomationLogsTableProps) {
  const totalPages = Math.ceil(totalCount / limit);
  const [expandedError, setExpandedError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="h-10 w-64 bg-gray-800 rounded-md animate-pulse" />
          <div className="h-10 w-40 bg-gray-800 rounded-md animate-pulse" />
          <div className="h-10 w-40 bg-gray-800 rounded-md animate-pulse" />
        </div>
        <div className="rounded-lg border border-gray-800">
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by user email..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500"
          />
        </div>
        <Select value={typeFilter} onValueChange={onTypeFilter}>
          <SelectTrigger className="w-[160px] bg-gray-900 border-gray-700 text-gray-200">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="subscription_detect">Sub Detect</SelectItem>
            <SelectItem value="bill_negotiate">Bill Negotiate</SelectItem>
            <SelectItem value="refund_find">Refund Find</SelectItem>
            <SelectItem value="price_monitor">Price Monitor</SelectItem>
            <SelectItem value="warranty_track">Warranty Track</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilter}>
          <SelectTrigger className="w-[150px] bg-gray-900 border-gray-700 text-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="started">Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="needs_review">Needs Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Savings</TableHead>
              <TableHead className="text-gray-400">Summary</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-8"
                >
                  No automation logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-gray-800 hover:bg-gray-800/50"
                >
                  <TableCell className="text-gray-300 text-sm">
                    {log.user_email || log.profile_id.slice(0, 8) + "..."}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
                      {typeLabels[log.automation_type] || log.automation_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusStyles[log.status] || "bg-gray-800 text-gray-400 border-gray-700"} border text-xs`}
                    >
                      {log.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {log.savings_cents > 0
                      ? formatCurrency(log.savings_cents / 100)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm max-w-[200px] truncate">
                    {log.result_summary || "—"}
                    {log.error_message && (
                      <button
                        onClick={() =>
                          setExpandedError(
                            expandedError === log.id ? null : log.id
                          )
                        }
                        className="ml-2 text-red-400 hover:text-red-300 inline-flex items-center"
                      >
                        <AlertCircle className="h-3 w-3" />
                      </button>
                    )}
                    {expandedError === log.id && log.error_message && (
                      <div className="mt-2 p-2 rounded bg-red-950/50 border border-red-900/30 text-red-300 text-xs whitespace-pre-wrap">
                        {log.error_message}
                      </div>
                    )}
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

      {/* Pagination */}
      {totalCount > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1}–
            {Math.min(page * limit, totalCount)} of {totalCount.toLocaleString()}{" "}
            logs
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
