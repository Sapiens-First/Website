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
  paid_until timestamptz,
  cancel_at_period_end boolean not null default false,
  stripe_schedule_id text unique,
  scheduled_price_id text,
  scheduled_change_at timestamptz,
  checkout_session_id text unique,
  checkout_expires_at timestamptz,
  created_at timestamptz not null default statement_timestamp(),
  updated_at timestamptz not null default statement_timestamp(),
  constraint memberships_scheduled_change_pair
    check ((scheduled_price_id is null) = (scheduled_change_at is null))
);

comment on column public.memberships.trial_started_at is
  'First Stripe-confirmed trial start. Preserve on rejoining; abandoned Checkout must not set it.';
comment on column public.memberships.paid_until is
  'Access boundary confirmed by a paid invoice. current_period_end alone does not prove payment.';
comment on column public.memberships.stripe_price_id is
  'Current Stripe Price; the server maps only approved USD monthly contribution Prices.';
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
