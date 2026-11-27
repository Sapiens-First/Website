-- My roles: members-only role assignments, primary email on profiles,
-- and person columns removed from the public Atlas read.
-- Suggested file name: supabase/migrations/20261127010000_my_roles.sql
-- Pair with lib/atlas/data.ts no longer selecting profile_id,
-- display_initials or engagement_level (they are no longer readable by anon).

-- 1. Primary email on profiles, copied from the sign-in account (auth.users).
create schema member_private;
revoke all on schema member_private from public, anon, authenticated;

alter table public.profiles
  add column primary_email text
  check (primary_email = lower(primary_email) and char_length(primary_email) <= 320);

create unique index profiles_primary_email_key
  on public.profiles (primary_email)
  where primary_email is not null;

create function member_private.profile_primary_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select lower(u.email) into new.primary_email
  from auth.users u
  where u.id = new.id;
  return new;
end;
$$;
revoke all on function member_private.profile_primary_email() from public, anon, authenticated;

create trigger profiles_primary_email
before insert or update on public.profiles
for each row execute function member_private.profile_primary_email();

create function member_private.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set primary_email = lower(new.email)
  where id = new.id;
  return null;
end;
$$;
revoke all on function member_private.sync_profile_email() from public, anon, authenticated;

create trigger sync_profile_primary_email
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function member_private.sync_profile_email();

-- Backfill existing profiles (the trigger reads auth.users).
update public.profiles p
set primary_email = lower(u.email)
from auth.users u
where u.id = p.id;

-- Members cannot write primary_email: existing column grants for
-- insert/update on profiles do not include it, and none are added here.

-- 2. Role assignments: who holds which circle or role. Members-only.
-- Types allowed: Energizer, Lead Link, Rep Link, Facilitator, Secretary.
create table public.role_assignments (
  id uuid primary key default gen_random_uuid(),
  governance_id text not null
    references public.atlas_governance (id) on delete restrict
    deferrable initially deferred,
  -- Null after the person's account or profile is deleted; history is kept.
  profile_id uuid
    references public.profiles (id) on delete set null,
  assignment_type text not null default 'Energizer'
    check (assignment_type in ('Energizer', 'Lead Link', 'Rep Link', 'Facilitator', 'Secretary')),
  engagement_level text
    check (engagement_level in ('Fellow', 'Steward', 'Staff')),
  started_at date not null default current_date,
  ended_at date,
  created_at timestamptz not null default statement_timestamp(),
  created_by uuid references public.profiles (id) on delete set null,
  constraint role_assignments_dates check (ended_at is null or ended_at >= started_at)
);

create unique index role_assignments_one_open
  on public.role_assignments (governance_id, profile_id, assignment_type)
  where ended_at is null;
create index role_assignments_profile_id_idx on public.role_assignments (profile_id);
create index role_assignments_governance_id_idx on public.role_assignments (governance_id);

alter table public.role_assignments enable row level security;

revoke all on table public.role_assignments from public, anon, authenticated;
grant select on table public.role_assignments to authenticated;
grant select, insert, update, delete on table public.role_assignments to service_role;

create policy role_assignments_select_own on public.role_assignments
for select to authenticated
using ((select auth.uid()) = profile_id);

-- 3. Member check. Single place that defines who counts as a member.
-- MEMBER DEFINITION: a signed-in user who currently holds a circle or role,
-- i.e. has a role_assignments row that has started, has not ended, and is on
-- a row that is not Retired or Completed. Payment or membership status does
-- not count. Security definer so this read bypasses role_assignments RLS and
-- the members policy below does not recurse.
grant usage on schema member_private to authenticated;

create function member_private.is_atlas_member()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.role_assignments a
    join public.atlas_governance g on g.id = a.governance_id
    where a.profile_id = (select auth.uid())
      and a.started_at <= current_date
      and (a.ended_at is null or a.ended_at > current_date)
      and g.status not in ('Retired', 'Completed')
  );
$$;
revoke all on function member_private.is_atlas_member() from public, anon, authenticated;
grant execute on function member_private.is_atlas_member() to authenticated, service_role;

create policy role_assignments_select_members on public.role_assignments
for select to authenticated
using ((select member_private.is_atlas_member()));

-- 4. my_roles(): the signed-in member's own circles and roles.
-- Keyed on auth.uid(); no email matching. Current assignments only unless
-- include_ended is true.
create function public.my_roles(include_ended boolean default false)
returns table (
  assignment_id uuid,
  governance_id text,
  name text,
  type text,
  status text,
  parent_circle_id text,
  parent_circle_name text,
  purpose text,
  accountabilities text,
  scope text,
  privileges text,
  assignment_type text,
  engagement_level text,
  started_at date,
  ended_at date
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    a.id, g.id, g.name, g.type, g.status, g.parent_circle_id, pc.name,
    g.purpose, g.accountabilities, g.scope, g.privileges,
    a.assignment_type, a.engagement_level, a.started_at, a.ended_at
  from public.role_assignments a
  join public.atlas_governance g on g.id = a.governance_id
  left join public.atlas_governance pc on pc.id = g.parent_circle_id
  where a.profile_id = (select auth.uid())
    and (
      include_ended
      or (
        a.started_at <= current_date
        and (a.ended_at is null or a.ended_at > current_date)
        and g.status not in ('Retired', 'Completed')
      )
    )
  order by g.name, a.assignment_type;
$$;
revoke all on function public.my_roles(boolean) from public, anon, authenticated;
grant execute on function public.my_roles(boolean) to authenticated, service_role;

-- 5. role_holders(): current holder of each circle or role, with display
-- name only (never email). Members see all; others see only their own rows.
create function public.role_holders()
returns table (
  assignment_id uuid,
  governance_id text,
  name text,
  type text,
  parent_circle_id text,
  parent_circle_name text,
  assignment_type text,
  engagement_level text,
  started_at date,
  holder_profile_id uuid,
  holder_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    a.id, g.id, g.name, g.type, g.parent_circle_id, pc.name,
    a.assignment_type, a.engagement_level, a.started_at,
    a.profile_id, p.full_name
  from public.role_assignments a
  join public.atlas_governance g on g.id = a.governance_id
  left join public.atlas_governance pc on pc.id = g.parent_circle_id
  join public.profiles p on p.id = a.profile_id
  where (select auth.uid()) is not null
    and (
      (select member_private.is_atlas_member())
      or a.profile_id = (select auth.uid())
    )
    and a.started_at <= current_date
    and (a.ended_at is null or a.ended_at > current_date)
    and g.status not in ('Retired', 'Completed')
  order by g.name, a.assignment_type, p.full_name;
$$;
revoke all on function public.role_holders() from public, anon, authenticated;
grant execute on function public.role_holders() to authenticated, service_role;

-- 6. Atlas public read: role text only, no person columns.
-- The old person columns stay for now; a later migration drops them.
revoke select on table public.atlas_governance from anon, authenticated;
grant select (
  id, name, type, parent_circle_id, purpose, accountabilities, scope,
  privileges, status, definition_note, assignment_basis
) on table public.atlas_governance to anon, authenticated;

-- Person links now live only in role_assignments.
alter table public.atlas_governance
  add constraint atlas_governance_no_person_columns
  check (profile_id is null and display_initials is null and engagement_level is null);
