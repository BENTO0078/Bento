"use client";

import Link from "next/link";
import { useAuth } from "@/components/shared/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const adminNavItems = [
  { name: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { name: "Users", href: "/admin/users", icon: "Users" },
  { name: "Revenue", href: "/admin/revenue", icon: "DollarSign" },
  { name: "Automations", href: "/admin/automations", icon: "Bot" },
  { name: "Settings", href: "/admin/settings", icon: "Settings" },
];

export function AdminHeader() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const displayName =
    profile?.full_name || user.email?.split("@")[0] || "User";
  const initials = getInitials(profile?.full_name || user.email || "");

  return (
    <header className="flex h-16 items-center justify-between border-b border-red-900/30 bg-gray-950/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-40">
      {/* Mobile menu trigger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-300">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-gray-950 border-r border-red-900/30"
          >
            <div className="flex h-16 items-center border-b border-red-900/30 px-6">
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
            <nav className="p-4 space-y-1">
              {adminNavItems.map((item) => {
                const isActive =
                  typeof window !== "undefined" &&
                  window.location.pathname === item.href;
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
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile logo */}
      <Link
        href="/admin"
        className="md:hidden flex items-center gap-2 font-bold text-lg text-gray-100"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-xs">
          B
        </div>
        <span>Bento Admin</span>
      </Link>

      {/* Admin indicator — desktop */}
      <div className="hidden md:flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-red-400" />
        <span className="text-sm font-medium text-red-400">Admin Panel</span>
      </div>

      {/* User menu */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2 text-gray-300 hover:text-gray-100 hover:bg-gray-800"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-red-900 text-red-200">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-gray-900 border-gray-700"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal text-gray-200">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-gray-400">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              asChild
              className="text-gray-300 cursor-pointer hover:text-gray-100 hover:bg-gray-800 focus:bg-gray-800"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem
              onClick={signOut}
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-800 focus:bg-gray-800"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
