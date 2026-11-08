-- Service-only transaction: a failed update must not consume the event ID.
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
  if exists (select 1 from public.stripe_webhook_events where event_id = p_event_id)
    then return 'duplicate'; end if;
  if membership.updated_at is distinct from p_expected_updated_at
    then return 'retry'; end if;
  incoming := pg_catalog.jsonb_populate_record(null::public.memberships, p_state);
  insert into public.stripe_webhook_events(event_id,event_type,stripe_created_at)
  values(p_event_id,p_event_type,p_event_created_at)
  on conflict(event_id) do nothing;
  if not found then return 'duplicate'; end if;
  update public.memberships set
    stripe_subscription_id = incoming.stripe_subscription_id,
    stripe_price_id = incoming.stripe_price_id,
    status = incoming.status,
    trial_started_at = least(membership.trial_started_at, incoming.trial_started_at),
    trial_end = incoming.trial_end,
    current_period_end = incoming.current_period_end,
    paid_until = incoming.paid_until,
    cancel_at_period_end = incoming.cancel_at_period_end,
    stripe_schedule_id = incoming.stripe_schedule_id,
    scheduled_price_id = case when incoming.stripe_schedule_id = membership.stripe_schedule_id
      then membership.scheduled_price_id else null end,
    scheduled_change_at = case when incoming.stripe_schedule_id = membership.stripe_schedule_id
      then membership.scheduled_change_at else null end
  where member_id = membership.member_id;
  return 'processed';
end;
$$;
revoke all on function public.sync_membership_event(text,text,timestamptz,text,timestamptz,jsonb)
from public, anon, authenticated;
grant execute on function public.sync_membership_event(text,text,timestamptz,text,timestamptz,jsonb)
to service_role;
