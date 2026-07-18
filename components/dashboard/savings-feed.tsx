import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  PhoneCall,
  RotateCcw,
  ArrowDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { SavingsEventType } from "@/types";

function getEventIcon(type: SavingsEventType) {
  switch (type) {
    case "subscription_cancelled":
      return {
        icon: <XCircle className="h-4 w-4" />,
        bg: "bg-red-50 dark:bg-red-900/20",
        fg: "text-red-600 dark:text-red-400",
      };
    case "bill_negotiated":
      return {
        icon: <PhoneCall className="h-4 w-4" />,
        bg: "bg-blue-50 dark:bg-blue-900/20",
        fg: "text-blue-600 dark:text-blue-400",
      };
    case "refund_found":
      return {
        icon: <RotateCcw className="h-4 w-4" />,
        bg: "bg-amber-50 dark:bg-amber-900/20",
        fg: "text-amber-600 dark:text-amber-400",
      };
    case "price_drop":
      return {
        icon: <ArrowDown className="h-4 w-4" />,
        bg: "bg-violet-50 dark:bg-violet-900/20",
        fg: "text-violet-600 dark:text-violet-400",
      };
    case "warranty_claim":
      return {
        icon: <ShieldCheck className="h-4 w-4" />,
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        fg: "text-emerald-600 dark:text-emerald-400",
      };
    default:
      return {
        icon: <Sparkles className="h-4 w-4" />,
        bg: "bg-gray-50 dark:bg-gray-800",
        fg: "text-gray-600 dark:text-gray-400",
      };
  }
}

function formatDollars(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export async function SavingsFeed() {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground text-center py-8">
              No savings yet. Complete onboarding to find savings!
            </p>
          </CardContent>
        </Card>
      );
    }

    const { data: events, error } = await supabase
      .from("savings_events")
      .select("*")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !events || events.length === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No savings yet. Complete onboarding to find savings!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your accounts and Bento will find savings automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {events.map((event) => {
          const { icon, bg, fg } = getEventIcon(
            event.event_type as SavingsEventType
          );
          const amountFormatted = formatDollars(event.amount_cents);
          const isPositive = event.amount_cents > 0;

          return (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}
                  >
                    <div className={fg}>{icon}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-snug">
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      {/* Amount badge */}
                      <Badge
                        variant={isPositive ? "default" : "secondary"}
                        className={`flex-shrink-0 font-mono text-xs ${
                          isPositive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-100"
                            : ""
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {amountFormatted}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formatRelativeTime(event.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  } catch {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            No savings yet. Complete onboarding to find savings!
          </p>
        </CardContent>
      </Card>
    );
  }
}
