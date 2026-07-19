-- ============================================================
-- Bento — Referrals Schema
-- Migration: 00004_referrals
-- Description: Referral tracking for LTD buyers and viral sharing
-- ============================================================

create table if not exists public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_email text not null,
  referred_email text,
  status text default 'pending' check (status in ('pending', 'signed_up', 'purchased')),
  created_at timestamptz default now()
);

-- Index for referrer lookups
create index idx_referrals_referrer_email on public.referrals(referrer_email);

-- Index for status-based queries
create index idx_referrals_status on public.referrals(status);

-- RLS: allow anonymous inserts (referral clicks) but not reads
alter table public.referrals enable row level security;

create policy "referrals_insert_anon" on public.referrals
  for insert with check (true);

-- Authenticated users can read referrals they made
create policy "referrals_select_authenticated" on public.referrals
  for select using (auth.role() = 'authenticated');
