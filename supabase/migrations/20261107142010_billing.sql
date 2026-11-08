-- Billing state is separate from user-editable onboarding profiles.
create table public.memberships (
  member_id uuid primary key references public.profiles(id) on delete restrict,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'none'
    check (status in (
      'none', 'incomplete', 'incomplete_expired', 'trialing', 'active',
      'past_due', 'canceled', 'unpaid', 'paused'
    )),
  trial_started_at timestamptz,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  checkout_session_id text unique,
  checkout_sync_requested_at timestamptz,
  billing_action_requested_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp()
);

comment on column public.memberships.trial_started_at is
  'First Stripe-confirmed trial start. Preserve on rejoining; abandoned Checkout must not set it.';
comment on column public.memberships.stripe_price_id is
  'Current Stripe Price; the server maps only approved USD monthly contribution Prices.';
comment on column public.memberships.checkout_sync_requested_at is
  'Checkout confirmation throttle. Separate from updated_at so webhook/profile writes cannot reset it.';
comment on table public.memberships is
  'One billing record per profile. Cancel/reconcile any Stripe subscription before deleting its profile.';

create function public.touch_membership_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := statement_timestamp();
  return new;
end;
$$;

revoke all on function public.touch_membership_updated_at()
  from public, anon, authenticated;

create trigger memberships_updated_at
before update on public.memberships
for each row execute function public.touch_membership_updated_at();

alter table public.memberships enable row level security;
revoke all on table public.memberships from public, anon, authenticated;
grant select on table public.memberships to authenticated;
grant select, insert, update, delete on table public.memberships to service_role;

create policy memberships_select_own
on public.memberships for select to authenticated
using ((select auth.uid()) = member_id);

-- Insert only in the same transaction as a successfully handled billing update.
-- A rollback must leave the event absent so Stripe can retry it.
create table public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  stripe_created_at timestamptz not null,
  processed_at timestamptz not null default statement_timestamp()
);

comment on table public.stripe_webhook_events is
  'Successful-event deduplication journal. Commit atomically with the membership update; do not store payment payloads.';

alter table public.stripe_webhook_events enable row level security;
revoke all on table public.stripe_webhook_events from public, anon, authenticated;
grant select, insert, update, delete on table public.stripe_webhook_events to service_role;

-- Service-only transaction: a failed update must not consume the event ID.
-- p_event_id is null for throttled Checkout confirmation (no Stripe event).
create function public.sync_membership_event(
  p_event_id text,
  p_event_type text,
  p_event_created_at timestamptz,
  p_customer_id text,
  p_expected_updated_at timestamptz,
  p_state jsonb
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  membership public.memberships;
  incoming public.memberships;
begin
  select * into membership from public.memberships
  where stripe_customer_id = p_customer_id for update;
  if not found then return 'ignored'; end if;
  if membership.updated_at is distinct from p_expected_updated_at
    then return 'retry'; end if;
  if p_event_id is not null then
    insert into public.stripe_webhook_events(event_id, event_type, stripe_created_at)
    values (p_event_id, p_event_type, p_event_created_at)
    on conflict (event_id) do nothing;
    if not found then return 'duplicate'; end if;
  end if;
  incoming := pg_catalog.jsonb_populate_record(null::public.memberships, p_state);
  update public.memberships set
    stripe_subscription_id = incoming.stripe_subscription_id,
    stripe_price_id = incoming.stripe_price_id,
    status = incoming.status,
    trial_started_at = least(membership.trial_started_at, incoming.trial_started_at),
    trial_end = incoming.trial_end,
    current_period_end = incoming.current_period_end,
    cancel_at_period_end = incoming.cancel_at_period_end
  where member_id = membership.member_id;
  return 'processed';
end;
$$;

revoke all on function public.sync_membership_event(text, text, timestamptz, text, timestamptz, jsonb)
  from public, anon, authenticated;
grant execute on function public.sync_membership_event(text, text, timestamptz, text, timestamptz, jsonb)
  to service_role;

-- Database clock and RLS decide access; no caller-supplied member ID or time.
-- Stripe keeps status active while a renewal invoice is being collected.
create function public.membership_access()
returns table(
  allowed boolean,
  status text,
  stripe_customer_id text,
  stripe_price_id text,
  trial_started_at timestamptz,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce(m.status in ('active', 'trialing')
      and m.current_period_end > statement_timestamp(), false),
    m.status, m.stripe_customer_id, m.stripe_price_id, m.trial_started_at,
    m.trial_end, m.current_period_end, m.cancel_at_period_end
  from public.memberships m where m.member_id = (select auth.uid());
$$;

revoke all on function public.membership_access() from public, anon;
grant execute on function public.membership_access() to authenticated;

-- Claim BEFORE any Stripe request; concurrent tabs/instances share the limit.
create function public.claim_checkout_reconciliation(p_member_id uuid)
returns table(stripe_customer_id text, checkout_session_id text)
language sql
security invoker
set search_path = ''
as $$
  update public.memberships as m
  set checkout_sync_requested_at = statement_timestamp()
  where m.member_id = p_member_id
    and m.stripe_customer_id is not null and m.checkout_session_id is not null
    and (m.checkout_sync_requested_at is null
      or m.checkout_sync_requested_at <= statement_timestamp() - interval '30 seconds')
  returning m.stripe_customer_id, m.checkout_session_id;
$$;

revoke all on function public.claim_checkout_reconciliation(uuid)
  from public, anon, authenticated;
grant execute on function public.claim_checkout_reconciliation(uuid) to service_role;

-- Shared Checkout/Portal cooldown, independent of webhook and confirmation writes.
create function public.claim_billing_action(p_member_id uuid)
returns table(member_id uuid)
language sql
security invoker
set search_path = ''
as $$
  insert into public.memberships as m(member_id, billing_action_requested_at)
  values (p_member_id, statement_timestamp())
  on conflict (member_id) do update
    set billing_action_requested_at = excluded.billing_action_requested_at
    where m.billing_action_requested_at is null
      or m.billing_action_requested_at <= statement_timestamp() - interval '5 seconds'
  returning m.member_id;
$$;

revoke all on function public.claim_billing_action(uuid)
  from public, anon, authenticated;
grant execute on function public.claim_billing_action(uuid) to service_role;
