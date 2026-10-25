create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 200),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  city text check (char_length(city) <= 120),
  region text check (char_length(region) <= 120),
  postal_code text check (char_length(postal_code) <= 32),
  phone text check (char_length(phone) <= 32),
  address text check (char_length(address) <= 500),
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

create function public.prepare_profile()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.full_name := nullif(regexp_replace(new.full_name, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');
  new.country_code := upper(nullif(regexp_replace(new.country_code, '^[[:space:]]+|[[:space:]]+$', '', 'g'), ''));
  new.city := nullif(regexp_replace(new.city, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');
  new.region := nullif(regexp_replace(new.region, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');
  new.postal_code := nullif(regexp_replace(new.postal_code, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');
  new.phone := nullif(regexp_replace(new.phone, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');
  new.address := nullif(regexp_replace(new.address, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');

  if tg_op = 'UPDATE' then
    if new.id is distinct from old.id then
      raise exception 'Profile account ID cannot be changed' using errcode = '23514';
    end if;
    new.created_at := old.created_at;
  else
    new.created_at := statement_timestamp();
  end if;
  new.updated_at := statement_timestamp();
  return new;
end;
$$;

revoke all on function public.prepare_profile() from public, anon, authenticated;

create trigger prepare_profile_before_write
before insert or update on public.profiles
for each row execute function public.prepare_profile();

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, full_name, country_code, city, region, postal_code, phone, address)
  on public.profiles to authenticated;
grant update (full_name, country_code, city, region, postal_code, phone, address)
  on public.profiles to authenticated;
grant select, insert, update, delete on table public.profiles to service_role;

create policy profiles_select_own on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

create policy profiles_insert_own on public.profiles
for insert to authenticated
with check ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
