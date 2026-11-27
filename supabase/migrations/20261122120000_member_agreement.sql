-- Members accept the member agreement before opening the dashboard.
-- Members write only the version; the database stamps the acceptance time.
alter table public.profiles
  add column agreement_version text check (char_length(agreement_version) <= 32),
  add column agreement_accepted_at timestamptz;

create or replace function public.prepare_profile()
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
  new.agreement_version := nullif(regexp_replace(new.agreement_version, '^[[:space:]]+|[[:space:]]+$', '', 'g'), '');

  if tg_op = 'UPDATE' then
    if new.id is distinct from old.id then
      raise exception 'Profile account ID cannot be changed' using errcode = '23514';
    end if;
    new.created_at := old.created_at;
    if new.agreement_version is distinct from old.agreement_version then
      new.agreement_accepted_at := case
        when new.agreement_version is null then null
        else statement_timestamp()
      end;
    else
      new.agreement_accepted_at := old.agreement_accepted_at;
    end if;
  else
    new.created_at := statement_timestamp();
    new.agreement_accepted_at := case
      when new.agreement_version is null then null
      else statement_timestamp()
    end;
  end if;
  new.updated_at := statement_timestamp();
  return new;
end;
$$;

revoke all on function public.prepare_profile() from public, anon, authenticated;

grant update (agreement_version) on public.profiles to authenticated;
