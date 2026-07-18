"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Bot,
  Settings,
  ShieldAlert,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Revenue",
    href: "/admin/revenue",
    icon: DollarSign,
  },
  {
    name: "Automations",
    href: "/admin/automations",
    icon: Bot,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-red-900/30 bg-gray-950">
      <div className="flex h-16 items-center justify-between border-b border-red-900/30 px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-xl text-gray-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm">
            B
          </div>
          <span>Bento</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 px-6 py-3 border-b border-red-900/20 bg-red-950/30">
        <ShieldAlert className="h-4 w-4 text-red-400" />
        <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
          Admin Mode
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-red-600/20 text-red-400 border border-red-600/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-red-900/30 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          Exit Admin
        </Link>
      </div>
    </aside>
  );
}
