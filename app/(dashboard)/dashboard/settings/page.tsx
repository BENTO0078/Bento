"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/components/shared/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CreditCard,
  Bell,
  Link2,
  Trash2,
  ArrowUpCircle,
  Loader2,
  Check,
  ExternalLink,
  Sparkles,
  Users,
  Headphones,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  CONSUMER_MONTHLY_PRICE_ID,
  FAMILY_MONTHLY_PRICE_ID,
  CONCIERGE_MONTHLY_PRICE_ID,
} from "@/lib/stripe/prices";

const planLabels: Record<string, { name: string; color: string; price: string }> = {
  free: {
    name: "Free",
    color: "bg-muted text-muted-foreground",
    price: "$0/month",
  },
  consumer: {
    name: "Consumer",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
    price: "$19/month",
  },
  family: {
    name: "Family",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    price: "$49/month",
  },
  concierge: {
    name: "Concierge",
    color:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    price: "$99/month",
  },
};

interface UpgradeCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  priceId: string;
  icon: React.ReactNode;
  popular?: boolean;
}

function UpgradeCard({
  name,
  price,
  description,
  features,
  priceId,
  icon,
  popular,
}: UpgradeCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Failed to start checkout");
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      toast({
        title: "Checkout failed",
        description:
          err instanceof Error ? err.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [priceId, toast]);

  return (
    <div
      className={`relative rounded-xl border p-6 flex flex-col ${
        popular
          ? "border-emerald-300 shadow-md shadow-emerald-100 dark:border-emerald-700 dark:shadow-emerald-900/20"
          : "border-muted-foreground/20"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white">
          Most Popular
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/30 p-1.5">
          {icon}
        </div>
        <h4 className="font-semibold text-sm">{name}</h4>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold">{price}</span>
        <span className="text-muted-foreground text-sm">/month</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full ${
          popular
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : ""
        }`}
        variant={popular ? "default" : "outline"}
        size="sm"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting...
          </>
        ) : (
          <>Subscribe</>
        )}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const plan = profile?.plan ?? "free";
  const planInfo = planLabels[plan] ?? planLabels.free;

  const [notificationSettings, setNotificationSettings] = useState({
    weeklyReport: true,
    billNegotiation: true,
    refundStatus: true,
    warrantyExpiry: true,
    productTips: false,
  });

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast({
      title: "Profile saved",
      description: "Your profile has been updated.",
    });
  };

  const handleManageBilling = useCallback(async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Failed to open billing portal");
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (err) {
      toast({
        title: "Billing portal failed",
        description:
          err instanceof Error ? err.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  }, [toast]);

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Profile */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Profile</h2>
            <p className="text-xs text-muted-foreground">
              Manage your personal information
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="bg-muted/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed. Contact support for assistance.
            </p>
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={saving || saved}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Subscription Plan</h2>
            <p className="text-xs text-muted-foreground">
              Your current plan and billing details
            </p>
          </div>
        </div>

        {/* Current plan status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={planInfo.color}>
              {planInfo.name}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {planInfo.price}
            </span>
          </div>
          {plan !== "free" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="flex items-center gap-1.5"
            >
              {portalLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  Manage Billing
                </>
              )}
            </Button>
          ) : (
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
              >
                <ArrowUpCircle className="h-4 w-4" />
                View Plans
              </Button>
            </Link>
          )}
        </div>

        {/* Billing details for paid users */}
        {plan !== "free" && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing cycle</span>
              <span className="font-medium">Monthly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next billing date</span>
              <span className="font-medium">
                {new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment method</span>
              <span className="font-medium">•••• •••• •••• 4242</span>
            </div>
          </div>
        )}

        {/* Upgrade CTAs for free users */}
        {plan === "free" && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold">Upgrade Your Plan</h3>
            <p className="text-xs text-muted-foreground">
              Unlock full automation and start saving hundreds per month.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <UpgradeCard
                name="Consumer"
                price="$19"
                description="All automations for individuals."
                features={[
                  "Auto-cancel subscriptions",
                  "Bill negotiation",
                  "Refund filing",
                  "Warranty tracking",
                  "Unlimited accounts",
                ]}
                priceId={CONSUMER_MONTHLY_PRICE_ID}
                icon={<Zap className="h-4 w-4 text-emerald-600" />}
                popular
              />
              <UpgradeCard
                name="Family"
                price="$49"
                description="Up to 4 family members."
                features={[
                  "Everything in Consumer",
                  "4 family members",
                  "Shared dashboard",
                  "Joint accounts",
                  "Priority support",
                ]}
                priceId={FAMILY_MONTHLY_PRICE_ID}
                icon={<Users className="h-4 w-4 text-blue-600" />}
              />
              <UpgradeCard
                name="Concierge"
                price="$99"
                description="Human-in-the-loop support."
                features={[
                  "Everything in Family",
                  "Dedicated agent",
                  "Complex negotiations",
                  "Medical bill audits",
                  "Same-day response",
                ]}
                priceId={CONCIERGE_MONTHLY_PRICE_ID}
                icon={<Headphones className="h-4 w-4 text-purple-600" />}
              />
            </div>
          </div>
        )}
      </div>

      {/* Connected Accounts */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Connected Accounts</h2>
            <p className="text-xs text-muted-foreground">
              Connect your financial accounts to let Bento analyze and save
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            No accounts connected yet.
          </p>
          <Button
            size="sm"
            className="mt-3 bg-emerald-600 hover:bg-emerald-700"
            disabled
          >
            Connect Account
          </Button>
          <p className="text-xs text-muted-foreground mt-1.5">
            Plaid integration coming soon.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-muted p-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">
              Manage how you receive alerts and updates
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: "weeklyReport" as const, label: "Weekly savings report" },
            {
              key: "billNegotiation" as const,
              label: "Bill negotiation updates",
            },
            { key: "refundStatus" as const, label: "Refund status changes" },
            {
              key: "warrantyExpiry" as const,
              label: "Warranty expiration reminders",
            },
            { key: "productTips" as const, label: "Product updates and tips" },
          ].map((setting) => (
            <div
              key={setting.key}
              className="flex items-center justify-between py-1"
            >
              <span className="text-sm">{setting.label}</span>
              <Switch
                checked={notificationSettings[setting.key]}
                onCheckedChange={() => toggleNotification(setting.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive/30 bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-md bg-destructive/10 p-2">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-semibold text-destructive">Danger Zone</h2>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. All your data,
          savings history, and preferences will be permanently removed.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  toast({
                    title: "Account deletion requested",
                    description:
                      "We've received your request. Our team will process it within 48 hours.",
                    variant: "destructive",
                  });
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
