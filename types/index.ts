// ============================================================
// Bento — Database Types
// Generated to match supabase/migrations/00001_initial_schema.sql
// ============================================================

// ---- Enums / Literal types used across tables ----

export type Plan = "free" | "consumer" | "family" | "concierge";

export type AccountType =
  | "checking"
  | "savings"
  | "credit"
  | "investment"
  | "loan"
  | "other";

export type AccountStatus = "active" | "error" | "disconnected";

export type BillingCycle =
  | "monthly"
  | "annual"
  | "quarterly"
  | "weekly";

export type BillBillingCycle =
  | "monthly"
  | "quarterly"
  | "semi-annual"
  | "annual";

export type SubscriptionCategory =
  | "entertainment"
  | "software"
  | "fitness"
  | "news"
  | "cloud"
  | "other";

export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "negotiating"
  | "paused";

export type DetectedBy = "ai" | "manual" | "plaid";

export type NegotiationStatus =
  | "none"
  | "in_progress"
  | "success"
  | "failed";

export type BillCategory =
  | "utilities"
  | "insurance"
  | "housing"
  | "medical"
  | "telecom"
  | "other";

export type BillStatus =
  | "active"
  | "cancelled"
  | "negotiating"
  | "paused";

export type WarrantyCategory =
  | "electronics"
  | "appliances"
  | "furniture"
  | "automotive"
  | "other";

export type WarrantyStatus =
  | "active"
  | "expiring_soon"
  | "expired"
  | "claimed";

export type RefundReason =
  | "price_drop"
  | "duplicate"
  | "service_outage"
  | "warranty"
  | "policy"
  | "other";

export type RefundStatus =
  | "pending"
  | "filed"
  | "approved"
  | "denied"
  | "received";

export type PriceAlertStatus = "active" | "claimed" | "expired";

export type ReferralStatus =
  | "pending"
  | "signed_up"
  | "subscribed"
  | "paid";

export type RewardType = "credit" | "cash" | "months_free";

export type AutomationType =
  | "subscription_detect"
  | "bill_negotiate"
  | "refund_find"
  | "price_monitor"
  | "warranty_track";

export type AutomationStatus =
  | "started"
  | "in_progress"
  | "completed"
  | "failed"
  | "needs_review";

export type SavingsEventType =
  | "subscription_cancelled"
  | "bill_negotiated"
  | "refund_found"
  | "price_drop"
  | "warranty_claim";

export type SourceType =
  | "subscriptions"
  | "bills"
  | "refunds"
  | "price_alerts";

// ---- Row types (matching table schemas exactly) ----

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  onboarding_completed: boolean;
  referral_code: string | null;
  referred_by: string | null;
  total_savings: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConnectedAccount {
  id: string;
  profile_id: string;
  institution_name: string | null;
  institution_id: string | null;
  account_name: string | null;
  account_type: AccountType | null;
  mask: string | null;
  plaid_access_token: string | null;
  plaid_item_id: string | null;
  status: AccountStatus;
  last_synced_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  profile_id: string;
  account_id: string | null;
  service_name: string;
  amount_cents: number;
  billing_cycle: BillingCycle;
  next_billing_date: string | null;
  category: SubscriptionCategory | null;
  status: SubscriptionStatus;
  detected_by: DetectedBy;
  is_user_confirmed: boolean;
  savings_cents: number;
  negotiation_status: NegotiationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bill {
  id: string;
  profile_id: string;
  account_id: string | null;
  bill_name: string;
  amount_cents: number;
  billing_cycle: BillBillingCycle;
  next_due_date: string | null;
  category: BillCategory | null;
  status: BillStatus;
  negotiation_eligible: boolean;
  negotiation_status: NegotiationStatus;
  provider_contact: string | null;
  savings_cents: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Warranty {
  id: string;
  profile_id: string;
  product_name: string;
  brand: string | null;
  purchase_date: string | null;
  purchase_amount_cents: number | null;
  warranty_length_months: number | null;
  warranty_expiry_date: string | null;
  receipt_url: string | null;
  retailer: string | null;
  category: WarrantyCategory | null;
  serial_number: string | null;
  status: WarrantyStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  id: string;
  profile_id: string;
  account_id: string | null;
  merchant_name: string;
  transaction_date: string | null;
  transaction_amount_cents: number | null;
  refund_amount_cents: number | null;
  reason: RefundReason | null;
  status: RefundStatus;
  confidence: number | null;
  requires_action: boolean;
  action_description: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  profile_id: string;
  product_name: string;
  purchase_price_cents: number | null;
  current_price_cents: number | null;
  price_drop_cents: number | null;
  retailer: string | null;
  purchase_date: string | null;
  price_drop_date: string | null;
  is_eligible_for_refund: boolean;
  status: PriceAlertStatus;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_email: string | null;
  referred_user_id: string | null;
  referral_code: string | null;
  status: ReferralStatus;
  reward_cents: number;
  reward_type: RewardType;
  paid_at: string | null;
  created_at: string;
}

export interface AutomationLog {
  id: string;
  profile_id: string;
  automation_type: AutomationType;
  status: AutomationStatus;
  result_summary: string | null;
  savings_cents: number;
  metadata: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface SavingsEvent {
  id: string;
  profile_id: string;
  event_type: SavingsEventType;
  title: string;
  description: string | null;
  amount_cents: number;
  source_id: string | null;
  source_type: SourceType | null;
  created_at: string;
}

// ---- Insert types (omit auto-generated fields) ----

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at">;
export type ConnectedAccountInsert = Omit<ConnectedAccount, "id" | "created_at">;
export type SubscriptionInsert = Omit<Subscription, "id" | "created_at" | "updated_at">;
export type BillInsert = Omit<Bill, "id" | "created_at" | "updated_at">;
export type WarrantyInsert = Omit<Warranty, "id" | "created_at" | "updated_at">;
export type RefundInsert = Omit<Refund, "id" | "created_at">;
export type PriceAlertInsert = Omit<PriceAlert, "id" | "created_at">;
export type ReferralInsert = Omit<Referral, "id" | "created_at">;
export type AutomationLogInsert = Omit<AutomationLog, "id" | "created_at">;
export type SavingsEventInsert = Omit<SavingsEvent, "id" | "created_at">;

// ---- Update types (all fields optional except id) ----

export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
export type ConnectedAccountUpdate = Partial<Omit<ConnectedAccount, "id" | "created_at">>;
export type SubscriptionUpdate = Partial<Omit<Subscription, "id" | "created_at" | "updated_at">>;
export type BillUpdate = Partial<Omit<Bill, "id" | "created_at" | "updated_at">>;
export type WarrantyUpdate = Partial<Omit<Warranty, "id" | "created_at" | "updated_at">>;
export type RefundUpdate = Partial<Omit<Refund, "id" | "created_at">>;
export type PriceAlertUpdate = Partial<Omit<PriceAlert, "id" | "created_at">>;
export type ReferralUpdate = Partial<Omit<Referral, "id" | "created_at">>;
export type AutomationLogUpdate = Partial<Omit<AutomationLog, "id" | "created_at">>;
export type SavingsEventUpdate = Partial<Omit<SavingsEvent, "id" | "created_at">>;

// ---- Database type (for Supabase client typing) ----

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_referred_by_fkey";
            columns: ["referred_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      connected_accounts: {
        Row: ConnectedAccount;
        Insert: ConnectedAccountInsert;
        Update: ConnectedAccountUpdate;
        Relationships: [
          {
            foreignKeyName: "connected_accounts_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: Subscription;
        Insert: SubscriptionInsert;
        Update: SubscriptionUpdate;
        Relationships: [
          {
            foreignKeyName: "subscriptions_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "connected_accounts";
            referencedColumns: ["id"];
          }
        ];
      };
      bills: {
        Row: Bill;
        Insert: BillInsert;
        Update: BillUpdate;
        Relationships: [
          {
            foreignKeyName: "bills_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bills_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "connected_accounts";
            referencedColumns: ["id"];
          }
        ];
      };
      warranties: {
        Row: Warranty;
        Insert: WarrantyInsert;
        Update: WarrantyUpdate;
        Relationships: [
          {
            foreignKeyName: "warranties_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      refunds: {
        Row: Refund;
        Insert: RefundInsert;
        Update: RefundUpdate;
        Relationships: [
          {
            foreignKeyName: "refunds_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "refunds_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "connected_accounts";
            referencedColumns: ["id"];
          }
        ];
      };
      price_alerts: {
        Row: PriceAlert;
        Insert: PriceAlertInsert;
        Update: PriceAlertUpdate;
        Relationships: [
          {
            foreignKeyName: "price_alerts_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      referrals: {
        Row: Referral;
        Insert: ReferralInsert;
        Update: ReferralUpdate;
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey";
            columns: ["referrer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referrals_referred_user_id_fkey";
            columns: ["referred_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      automation_logs: {
        Row: AutomationLog;
        Insert: AutomationLogInsert;
        Update: AutomationLogUpdate;
        Relationships: [
          {
            foreignKeyName: "automation_logs_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      savings_events: {
        Row: SavingsEvent;
        Insert: SavingsEventInsert;
        Update: SavingsEventUpdate;
        Relationships: [
          {
            foreignKeyName: "savings_events_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
