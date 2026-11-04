create table public.campaign_signatures (
  id uuid primary key default gen_random_uuid(),
  campaign_id text not null check (campaign_id in ('freeze-ai', 'stop-1984', 'no-killer-robots', 'citizens-dividend')),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' and email = lower(btrim(email))),
  name text check (char_length(name) <= 120),
  zip text check (char_length(zip) <= 20),
  phone text check (char_length(phone) <= 30),
  email_updates boolean not null default false,
  signed_at timestamptz not null default statement_timestamp(),
  unique (campaign_id, email)
);

alter table public.campaign_signatures enable row level security;
revoke all on public.campaign_signatures from public, anon, authenticated;
grant all on public.campaign_signatures to service_role;

create schema if not exists campaign_private;
grant usage on schema campaign_private to anon, authenticated;

create function campaign_private.sign_campaign(campaign text, signer_email text, signer_name text, signer_zip text, signer_phone text, agreed boolean, updates boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if agreed is distinct from true then
    raise exception 'Explicit confirmation required' using errcode = '22023';
  end if;
  insert into public.campaign_signatures (campaign_id, email, name, zip, phone, email_updates)
    values (campaign, lower(btrim(signer_email)), nullif(btrim(signer_name), ''), nullif(btrim(signer_zip), ''), nullif(btrim(signer_phone), ''), coalesce(updates, false))
    on conflict (campaign_id, email) do nothing;
end;
$$;
revoke all on function campaign_private.sign_campaign(text, text, text, text, text, boolean, boolean) from public;
grant execute on function campaign_private.sign_campaign(text, text, text, text, text, boolean, boolean) to anon, authenticated;

create function public.sign_campaign(campaign text, signer_email text, signer_name text, signer_zip text, signer_phone text, agreed boolean, updates boolean)
returns void
language sql security invoker set search_path = ''
as $$ select campaign_private.sign_campaign(campaign, signer_email, signer_name, signer_zip, signer_phone, agreed, updates); $$;
revoke all on function public.sign_campaign(text, text, text, text, text, boolean, boolean) from public;
grant execute on function public.sign_campaign(text, text, text, text, text, boolean, boolean) to anon, authenticated;
