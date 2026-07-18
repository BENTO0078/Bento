-- ============================================================
-- Bento — Referral Code Generation
-- Migration: 00002_referral_triggers
-- Description: Auto-generate unique 8-char referral codes for profiles
-- ============================================================

-- ============================================================
-- Helper: generate a unique 8-character alphanumeric code
-- ============================================================
create or replace function public.generate_referral_code()
returns text as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text;
  done boolean;
begin
  loop
    result := '';
    for i in 1..8 loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    end loop;
    -- Ensure uniqueness
    select not exists(select 1 from public.profiles where referral_code = result) into done;
    if done then
      return result;
    end if;
  end loop;
end;
$$ language plpgsql volatile;

-- ============================================================
-- Update handle_new_user() to generate referral code
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  generated_code text;
begin
  generated_code := public.generate_referral_code();
  insert into public.profiles (id, email, full_name, avatar_url, referral_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    generated_code
  );
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- Backfill: generate referral codes for existing profiles
-- ============================================================
do $$
declare
  r record;
  new_code text;
begin
  for r in select id from public.profiles where referral_code is null loop
    new_code := public.generate_referral_code();
    update public.profiles set referral_code = new_code where id = r.id;
  end loop;
end;
$$;
