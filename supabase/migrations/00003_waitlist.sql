-- ============================================================
-- Bento — Waitlist Schema
-- Migration: 00003_waitlist
-- Description: Email capture table for calculator and other sources
-- ============================================================

create table if not exists public.waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text default 'calculator',
  created_at timestamptz default now()
);

-- RLS: allow anonymous inserts (calculator visitors) but not reads
alter table public.waitlist enable row level security;

create policy "waitlist_insert_anon" on public.waitlist
  for insert with check (true);

-- Only authenticated users can read the waitlist (founder dashboard)
create policy "waitlist_select_authenticated" on public.waitlist
  for select using (auth.role() = 'authenticated');
