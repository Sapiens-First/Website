create table public.campaign_signatures (
  member_id uuid not null references public.profiles(id) on delete cascade,
  campaign_id text not null check (campaign_id in ('freeze-ai', 'stop-1984', 'no-killer-robots', 'citizens-dividend')),
  email text not null check (length(btrim(email)) between 3 and 254),
  email_updates boolean not null default false,
  signed_at timestamptz not null default statement_timestamp(),
  primary key (member_id, campaign_id)
);
alter table public.campaign_signatures enable row level security;
revoke all on public.campaign_signatures from public, anon, authenticated;
grant select on public.campaign_signatures to authenticated;
grant all on public.campaign_signatures to service_role;
create policy campaign_signatures_select_own on public.campaign_signatures
for select to authenticated using ((select auth.uid()) = member_id);

-- Keep privileged implementation outside the Data API's exposed schema.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
create function private.sign_campaign(campaign text, agreed boolean, updates boolean)
returns table (signed_at timestamptz, email_updates boolean)
language plpgsql security definer set search_path = ''
as $$
declare
  signer uuid := auth.uid();
  signer_email text;
begin
  if signer is null or agreed is distinct from true or updates is null then
    raise exception 'Explicit member confirmation required' using errcode = '42501';
  end if;
  select u.email into signer_email from auth.users u
    where u.id = signer and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false);
  if signer_email is null or not exists (
    select 1 from public.profiles p where p.id = signer
      and length(btrim(p.full_name)) > 0 and p.country_code ~ '^[A-Z]{2}$'
      and length(btrim(p.city)) > 0
  ) then
    raise exception 'Complete confirmed member account required' using errcode = '42501';
  end if;
  insert into public.campaign_signatures (member_id, campaign_id, email, email_updates)
    values (signer, campaign, signer_email, updates)
    on conflict (member_id, campaign_id) do nothing;
  return query select s.signed_at, s.email_updates from public.campaign_signatures s
    where s.member_id = signer and s.campaign_id = campaign;
end;
$$;
revoke all on function private.sign_campaign(text, boolean, boolean) from public, anon;
grant execute on function private.sign_campaign(text, boolean, boolean) to authenticated;

create function public.sign_campaign(campaign text, agreed boolean, updates boolean)
returns table (signed_at timestamptz, email_updates boolean)
language sql security invoker set search_path = ''
as $$ select * from private.sign_campaign(campaign, agreed, updates); $$;
revoke all on function public.sign_campaign(text, boolean, boolean) from public, anon;
grant execute on function public.sign_campaign(text, boolean, boolean) to authenticated;
