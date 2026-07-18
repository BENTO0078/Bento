-- ============================================================
-- Bento — Admin Flag Migration
-- Migration: 00003_admin_flag
-- Description: Add is_admin boolean to profiles for admin dashboard access
-- ============================================================

-- Add is_admin column to profiles
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Create index for fast admin lookups
create index if not exists idx_profiles_is_admin
  on public.profiles (is_admin)
  where is_admin = true;

-- Admin RLS policy: allow admins to read all profiles
create policy "profiles_select_admin" on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );

-- Admin RLS policy: allow admins to update all profiles
create policy "profiles_update_admin" on public.profiles
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );

-- Admin bypass RLS for automation_logs (admin can read all)
create policy "automation_logs_select_admin" on public.automation_logs
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );

-- Admin bypass RLS for subscriptions (admin can read all)
create policy "subscriptions_select_admin" on public.subscriptions
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );

-- Admin bypass RLS for referrals (admin can read all)
create policy "referrals_select_admin" on public.referrals
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );
