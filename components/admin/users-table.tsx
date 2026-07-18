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
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
  onboarding_completed: boolean;
  total_savings: number;
  created_at: string;
  is_admin: boolean;
}

interface UsersTableProps {
  users: AdminUser[];
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onPlanFilter: (plan: string) => void;
  onOnboardingFilter: (completed: string) => void;
  searchQuery: string;
  planFilter: string;
  onboardingFilter: string;
  isLoading?: boolean;
}

export function UsersTable({
  users,
  totalCount,
  page,
  limit,
  onPageChange,
  onSearch,
  onPlanFilter,
  onOnboardingFilter,
  searchQuery,
  planFilter,
  onboardingFilter,
  isLoading,
}: UsersTableProps) {
  const totalPages = Math.ceil(totalCount / limit);

  const planBadgeVariant = (plan: string) => {
    switch (plan) {
      case "consumer":
        return "bg-blue-900/50 text-blue-300 border-blue-700/50";
      case "family":
        return "bg-purple-900/50 text-purple-300 border-purple-700/50";
      case "concierge":
        return "bg-amber-900/50 text-amber-300 border-amber-700/50";
      default:
        return "bg-gray-800 text-gray-400 border-gray-700";
    }
  };

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
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500"
          />
        </div>
        <Select value={planFilter} onValueChange={onPlanFilter}>
          <SelectTrigger className="w-[140px] bg-gray-900 border-gray-700 text-gray-200">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="consumer">Consumer</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="concierge">Concierge</SelectItem>
          </SelectContent>
        </Select>
        <Select value={onboardingFilter} onValueChange={onOnboardingFilter}>
          <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-gray-200">
            <SelectValue placeholder="Onboarding" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Plan</TableHead>
              <TableHead className="text-gray-400">Savings</TableHead>
              <TableHead className="text-gray-400">Onboarding</TableHead>
              <TableHead className="text-gray-400">Signed Up</TableHead>
              <TableHead className="text-gray-400 w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 py-8"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-gray-800 hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium text-gray-200">
                    <div className="flex items-center gap-2">
                      {user.full_name || "—"}
                      {user.is_admin && (
                        <Badge className="bg-red-900/50 text-red-300 border-red-700/50 text-[10px] px-1.5 py-0">
                          ADMIN
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {user.email || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${planBadgeVariant(user.plan)} border text-xs`}
                    >
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatCurrency(user.total_savings / 100)}
                  </TableCell>
                  <TableCell>
                    {user.onboarding_completed ? (
                      <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700/50 text-xs">
                        Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-800 text-gray-400 border-gray-700 text-xs">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
            users
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
