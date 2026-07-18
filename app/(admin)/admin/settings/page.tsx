"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, AlertTriangle } from "lucide-react";

interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function AdminSettingsPage() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      key: "ai_subscription_detect",
      label: "AI Subscription Detection",
      description: "Automatically scan bank statements to detect recurring subscriptions",
      enabled: true,
    },
    {
      key: "ai_bill_negotiate",
      label: "AI Bill Negotiation",
      description: "Automatically negotiate bills with providers via email/call scripts",
      enabled: true,
    },
    {
      key: "ai_refund_find",
      label: "AI Refund Finder",
      description: "Scan purchases for price drops and refund opportunities",
      enabled: true,
    },
    {
      key: "ai_price_monitor",
      label: "AI Price Monitor",
      description: "Track prices after purchase and alert when drops occur",
      enabled: true,
    },
    {
      key: "ai_warranty_track",
      label: "AI Warranty Tracking",
      description: "Extract warranty info from receipts and track expiration",
      enabled: true,
    },
    {
      key: "referral_program",
      label: "Referral Program",
      description: "Enable user-to-user referral links and rewards",
      enabled: true,
    },
    {
      key: "weekly_share_nudge",
      label: "Weekly Share Nudge",
      description: "Show weekly savings share prompt on dashboard",
      enabled: true,
    },
    {
      key: "beta_features",
      label: "Beta Features",
      description: "Enable experimental features for early access users",
      enabled: false,
    },
  ]);

  const [rateLimits, setRateLimits] = useState({
    aiAutomationsPerHour: 50,
    aiAutomationsPerDay: 200,
    maxSubscriptionsPerUser: 100,
    maxBillsPerUser: 50,
  });

  const [saved, setSaved] = useState(false);

  const toggleFeature = (key: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
    setSaved(false);
  };

  const handleSave = () => {
    // In production, this would persist to Supabase or env
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">
          Admin Settings
        </h1>
        <p className="text-gray-400 mt-1">
          System configuration, feature flags, and rate limits.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        {/* Feature Flags */}
        <section>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">
            Feature Flags
          </h2>
          <div className="rounded-lg border border-gray-800 divide-y divide-gray-800">
            {featureFlags.map((flag) => (
              <div
                key={flag.key}
                className="flex items-center justify-between p-4"
              >
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-200">
                      {flag.label}
                    </span>
                    {!flag.enabled && (
                      <Badge className="bg-gray-800 text-gray-400 border-gray-700 text-[10px]">
                        OFF
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {flag.description}
                  </p>
                </div>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => toggleFeature(flag.key)}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">
            Rate Limits
          </h2>
          <div className="rounded-lg border border-gray-800 p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  AI Automations / Hour
                </Label>
                <Input
                  type="number"
                  value={rateLimits.aiAutomationsPerHour}
                  onChange={(e) => {
                    setRateLimits((prev) => ({
                      ...prev,
                      aiAutomationsPerHour: parseInt(e.target.value) || 0,
                    }));
                    setSaved(false);
                  }}
                  className="bg-gray-900 border-gray-700 text-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  AI Automations / Day
                </Label>
                <Input
                  type="number"
                  value={rateLimits.aiAutomationsPerDay}
                  onChange={(e) => {
                    setRateLimits((prev) => ({
                      ...prev,
                      aiAutomationsPerDay: parseInt(e.target.value) || 0,
                    }));
                    setSaved(false);
                  }}
                  className="bg-gray-900 border-gray-700 text-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  Max Subscriptions / User
                </Label>
                <Input
                  type="number"
                  value={rateLimits.maxSubscriptionsPerUser}
                  onChange={(e) => {
                    setRateLimits((prev) => ({
                      ...prev,
                      maxSubscriptionsPerUser: parseInt(e.target.value) || 0,
                    }));
                    setSaved(false);
                  }}
                  className="bg-gray-900 border-gray-700 text-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  Max Bills / User
                </Label>
                <Input
                  type="number"
                  value={rateLimits.maxBillsPerUser}
                  onChange={(e) => {
                    setRateLimits((prev) => ({
                      ...prev,
                      maxBillsPerUser: parseInt(e.target.value) || 0,
                    }));
                    setSaved(false);
                  }}
                  className="bg-gray-900 border-gray-700 text-gray-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-semibold text-red-400 mb-4">
            Danger Zone
          </h2>
          <div className="rounded-lg border border-red-900/50 bg-red-950/10 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Reset all automation logs
                </p>
                <p className="text-xs text-red-400/70 mt-1">
                  This permanently deletes all automation log entries. This
                  action cannot be undone.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-800 text-red-400 hover:bg-red-950/50 hover:text-red-300"
              disabled
            >
              Reset Automation Logs
            </Button>
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
          {saved && (
            <span className="text-sm text-emerald-400">
              Settings saved successfully.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
