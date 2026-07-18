-- ============================================================
-- Bento — Initial Database Schema
-- Migration: 00001_initial_schema
-- Description: Core tables, RLS policies, triggers, and indexes
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto" with schema extensions;

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- 1. PROFILES
-- Extends auth.users. One row per user.
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'consumer', 'family', 'concierge')),
  stripe_customer_id text,
  onboarding_completed boolean not null default false,
  referral_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  total_savings integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile when auth.users row is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Allow reading referral_code for lookup (any authenticated user)
create policy "profiles_select_referral_lookup" on public.profiles
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- 2. CONNECTED_ACCOUNTS
-- Financial accounts linked via Plaid (or manual entry).
-- ============================================================
create table public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  institution_name text,
  institution_id text,
  account_name text,
  account_type text check (account_type in ('checking', 'savings', 'credit', 'investment', 'loan', 'other')),
  mask text,
  plaid_access_token text,
  plaid_item_id text,
  status text not null default 'active' check (status in ('active', 'error', 'disconnected')),
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

create trigger trg_connected_accounts_updated_at
  before update on public.connected_accounts
  for each row execute function public.set_updated_at();

alter table public.connected_accounts enable row level security;

create policy "connected_accounts_select_own" on public.connected_accounts
  for select using (auth.uid() = profile_id);

create policy "connected_accounts_insert_own" on public.connected_accounts
  for insert with check (auth.uid() = profile_id);

create policy "connected_accounts_update_own" on public.connected_accounts
  for update using (auth.uid() = profile_id);

create policy "connected_accounts_delete_own" on public.connected_accounts
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 3. SUBSCRIPTIONS
-- Subscriptions Bento has detected/cancelled/negotiated.
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.connected_accounts(id) on delete set null,
  service_name text not null,
  amount_cents integer not null default 0,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'annual', 'quarterly', 'weekly')),
  next_billing_date date,
  category text check (category in ('entertainment', 'software', 'fitness', 'news', 'cloud', 'other')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'negotiating', 'paused')),
  detected_by text not null default 'manual' check (detected_by in ('ai', 'manual', 'plaid')),
  is_user_confirmed boolean not null default false,
  savings_cents integer not null default 0,
  negotiation_status text default 'none' check (negotiation_status in ('none', 'in_progress', 'success', 'failed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = profile_id);

create policy "subscriptions_insert_own" on public.subscriptions
  for insert with check (auth.uid() = profile_id);

create policy "subscriptions_update_own" on public.subscriptions
  for update using (auth.uid() = profile_id);

create policy "subscriptions_delete_own" on public.subscriptions
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 4. BILLS
-- Recurring bills Bento tracks (utilities, insurance, rent, etc.)
-- ============================================================
create table public.bills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.connected_accounts(id) on delete set null,
  bill_name text not null,
  amount_cents integer not null default 0,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'quarterly', 'semi-annual', 'annual')),
  next_due_date date,
  category text check (category in ('utilities', 'insurance', 'housing', 'medical', 'telecom', 'other')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'negotiating', 'paused')),
  negotiation_eligible boolean not null default false,
  negotiation_status text default 'none' check (negotiation_status in ('none', 'in_progress', 'success', 'failed')),
  provider_contact text,
  savings_cents integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_bills_updated_at
  before update on public.bills
  for each row execute function public.set_updated_at();

alter table public.bills enable row level security;

create policy "bills_select_own" on public.bills
  for select using (auth.uid() = profile_id);

create policy "bills_insert_own" on public.bills
  for insert with check (auth.uid() = profile_id);

create policy "bills_update_own" on public.bills
  for update using (auth.uid() = profile_id);

create policy "bills_delete_own" on public.bills
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 5. WARRANTIES
-- Product warranties Bento tracks.
-- ============================================================
create table public.warranties (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  product_name text not null,
  brand text,
  purchase_date date,
  purchase_amount_cents integer,
  warranty_length_months integer,
  warranty_expiry_date date,
  receipt_url text,
  retailer text,
  category text check (category in ('electronics', 'appliances', 'furniture', 'automotive', 'other')),
  serial_number text,
  status text not null default 'active' check (status in ('active', 'expiring_soon', 'expired', 'claimed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_warranties_updated_at
  before update on public.warranties
  for each row execute function public.set_updated_at();

alter table public.warranties enable row level security;

create policy "warranties_select_own" on public.warranties
  for select using (auth.uid() = profile_id);

create policy "warranties_insert_own" on public.warranties
  for insert with check (auth.uid() = profile_id);

create policy "warranties_update_own" on public.warranties
  for update using (auth.uid() = profile_id);

create policy "warranties_delete_own" on public.warranties
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 6. REFUNDS
-- Refund opportunities Bento found.
-- ============================================================
create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  account_id uuid references public.connected_accounts(id) on delete set null,
  merchant_name text not null,
  transaction_date date,
  transaction_amount_cents integer,
  refund_amount_cents integer,
  reason text check (reason in ('price_drop', 'duplicate', 'service_outage', 'warranty', 'policy', 'other')),
  status text not null default 'pending' check (status in ('pending', 'filed', 'approved', 'denied', 'received')),
  confidence integer check (confidence >= 0 and confidence <= 100),
  requires_action boolean not null default true,
  action_description text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create trigger trg_refunds_updated_at
  before update on public.refunds
  for each row execute function public.set_updated_at();

alter table public.refunds enable row level security;

create policy "refunds_select_own" on public.refunds
  for select using (auth.uid() = profile_id);

create policy "refunds_insert_own" on public.refunds
  for insert with check (auth.uid() = profile_id);

create policy "refunds_update_own" on public.refunds
  for update using (auth.uid() = profile_id);

create policy "refunds_delete_own" on public.refunds
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 7. PRICE_ALERTS
-- Price drops after purchase.
-- ============================================================
create table public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  product_name text not null,
  purchase_price_cents integer,
  current_price_cents integer,
  price_drop_cents integer,
  retailer text,
  purchase_date date,
  price_drop_date date,
  is_eligible_for_refund boolean not null default false,
  status text not null default 'active' check (status in ('active', 'claimed', 'expired')),
  created_at timestamptz not null default now()
);

create trigger trg_price_alerts_updated_at
  before update on public.price_alerts
  for each row execute function public.set_updated_at();

alter table public.price_alerts enable row level security;

create policy "price_alerts_select_own" on public.price_alerts
  for select using (auth.uid() = profile_id);

create policy "price_alerts_insert_own" on public.price_alerts
  for insert with check (auth.uid() = profile_id);

create policy "price_alerts_update_own" on public.price_alerts
  for update using (auth.uid() = profile_id);

create policy "price_alerts_delete_own" on public.price_alerts
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 8. REFERRALS
-- Referral program tracking.
-- ============================================================
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles(id) on delete cascade,
  referred_email text,
  referred_user_id uuid references public.profiles(id) on delete set null,
  referral_code text,
  status text not null default 'pending' check (status in ('pending', 'signed_up', 'subscribed', 'paid')),
  reward_cents integer not null default 0,
  reward_type text not null default 'credit' check (reward_type in ('credit', 'cash', 'months_free')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create trigger trg_referrals_updated_at
  before update on public.referrals
  for each row execute function public.set_updated_at();

alter table public.referrals enable row level security;

create policy "referrals_select_own" on public.referrals
  for select using (auth.uid() = referrer_id);

create policy "referrals_insert_own" on public.referrals
  for insert with check (auth.uid() = referrer_id);

create policy "referrals_update_own" on public.referrals
  for update using (auth.uid() = referrer_id);

create policy "referrals_delete_own" on public.referrals
  for delete using (auth.uid() = referrer_id);

-- ============================================================
-- 9. AUTOMATION_LOGS
-- Log of all AI automations performed.
-- ============================================================
create table public.automation_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  automation_type text not null check (automation_type in ('subscription_detect', 'bill_negotiate', 'refund_find', 'price_monitor', 'warranty_track')),
  status text not null default 'started' check (status in ('started', 'in_progress', 'completed', 'failed', 'needs_review')),
  result_summary text,
  savings_cents integer not null default 0,
  metadata jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create trigger trg_automation_logs_updated_at
  before update on public.automation_logs
  for each row execute function public.set_updated_at();

alter table public.automation_logs enable row level security;

create policy "automation_logs_select_own" on public.automation_logs
  for select using (auth.uid() = profile_id);

create policy "automation_logs_insert_own" on public.automation_logs
  for insert with check (auth.uid() = profile_id);

create policy "automation_logs_update_own" on public.automation_logs
  for update using (auth.uid() = profile_id);

create policy "automation_logs_delete_own" on public.automation_logs
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- 10. SAVINGS_EVENTS
-- Individual savings events for the dashboard feed.
-- ============================================================
create table public.savings_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in ('subscription_cancelled', 'bill_negotiated', 'refund_found', 'price_drop', 'warranty_claim')),
  title text not null,
  description text,
  amount_cents integer not null default 0,
  source_id uuid,
  source_type text check (source_type in ('subscriptions', 'bills', 'refunds', 'price_alerts')),
  created_at timestamptz not null default now()
);

alter table public.savings_events enable row level security;

create policy "savings_events_select_own" on public.savings_events
  for select using (auth.uid() = profile_id);

create policy "savings_events_insert_own" on public.savings_events
  for insert with check (auth.uid() = profile_id);

create policy "savings_events_update_own" on public.savings_events
  for update using (auth.uid() = profile_id);

create policy "savings_events_delete_own" on public.savings_events
  for delete using (auth.uid() = profile_id);

-- ============================================================
-- INDEXES
-- ============================================================

-- Foreign key indexes
create index idx_connected_accounts_profile_id on public.connected_accounts(profile_id);
create index idx_subscriptions_profile_id on public.subscriptions(profile_id);
create index idx_subscriptions_account_id on public.subscriptions(account_id);
create index idx_bills_profile_id on public.bills(profile_id);
create index idx_bills_account_id on public.bills(account_id);
create index idx_warranties_profile_id on public.warranties(profile_id);
create index idx_refunds_profile_id on public.refunds(profile_id);
create index idx_refunds_account_id on public.refunds(account_id);
create index idx_price_alerts_profile_id on public.price_alerts(profile_id);
create index idx_referrals_referrer_id on public.referrals(referrer_id);
create index idx_referrals_referred_user_id on public.referrals(referred_user_id);
create index idx_automation_logs_profile_id on public.automation_logs(profile_id);
create index idx_savings_events_profile_id on public.savings_events(profile_id);

-- Composite profile_id + status indexes for filtered queries
create index idx_connected_accounts_profile_status on public.connected_accounts(profile_id, status);
create index idx_subscriptions_profile_status on public.subscriptions(profile_id, status);
create index idx_bills_profile_status on public.bills(profile_id, status);
create index idx_warranties_profile_status on public.warranties(profile_id, status);
create index idx_refunds_profile_status on public.refunds(profile_id, status);
create index idx_price_alerts_profile_status on public.price_alerts(profile_id, status);
create index idx_referrals_referrer_status on public.referrals(referrer_id, status);
create index idx_automation_logs_profile_status on public.automation_logs(profile_id, status);

-- Referral code lookup
create index idx_profiles_referral_code on public.profiles(referral_code) where referral_code is not null;

-- Savings events feed ordering
create index idx_savings_events_created_at on public.savings_events(profile_id, created_at desc);

-- Automation logs type + status
create index idx_automation_logs_type_status on public.automation_logs(profile_id, automation_type, status);
