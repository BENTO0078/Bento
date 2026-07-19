-- ============================================================
-- Bento — Analytics Schema
-- Migration: 00002_analytics
-- Description: Lightweight server-side pageview tracking table
-- ============================================================

-- ============================================================
-- ANALYTICS PAGEVIEWS
-- Server-side only, no client JS, no cookies, no PII
-- ============================================================
create table public.analytics_pageviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  referrer text,
  user_agent text,
  ip_hash text
);

-- Indexes for common dashboard queries
create index idx_analytics_pageviews_created_at on public.analytics_pageviews(created_at desc);
create index idx_analytics_pageviews_path on public.analytics_pageviews(path);
create index idx_analytics_pageviews_ip_hash on public.analytics_pageviews(ip_hash);

-- RLS: allow authenticated users to read analytics (founder dashboard)
-- Inserts are done via service role (middleware), bypassing RLS
alter table public.analytics_pageviews enable row level security;

create policy "analytics_pageviews_select_authenticated" on public.analytics_pageviews
  for select using (auth.role() = 'authenticated');

-- No insert policy needed — middleware uses service role which bypasses RLS

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Top N pages by view count
create or replace function public.get_top_pages(n integer default 5)
returns table(path text, count bigint) as $
begin
  return query
  select ap.path, count(*)::bigint
  from public.analytics_pageviews ap
  group by ap.path
  order by count(*) desc
  limit n;
end;
$ language plpgsql security definer;

-- Top N referrers by view count (ignoring null referrers)
create or replace function public.get_top_referrers(n integer default 5)
returns table(referrer text, count bigint) as $
begin
  return query
  select ap.referrer, count(*)::bigint
  from public.analytics_pageviews ap
  where ap.referrer is not null
  group by ap.referrer
  order by count(*) desc
  limit n;
end;
$ language plpgsql security definer;
