"use client";

import { useEffect, useState, useCallback } from "react";
import { UsersTable, type AdminUser } from "@/components/admin/users-table";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [onboardingFilter, setOnboardingFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const limit = 50;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (searchQuery) params.set("search", searchQuery);
    if (planFilter !== "all") params.set("plan", planFilter);
    if (onboardingFilter !== "all") params.set("onboarding", onboardingFilter);

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotalCount(data.total || 0);
    setIsLoading(false);
  }, [page, searchQuery, planFilter, onboardingFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">
          User Management
        </h1>
        <p className="text-gray-400 mt-1">
          Search, filter, and manage all Bento users.
        </p>
      </div>

      <UsersTable
        users={users}
        totalCount={totalCount}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSearch={setSearchQuery}
        onPlanFilter={setPlanFilter}
        onOnboardingFilter={setOnboardingFilter}
        searchQuery={searchQuery}
        planFilter={planFilter}
        onboardingFilter={onboardingFilter}
        isLoading={isLoading}
      />
    </div>
  );
}
