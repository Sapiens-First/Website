create table public.atlas_domains (
  id text primary key check (id ~ '^D-[0-9]+$'),
  name text not null check (length(btrim(name)) > 0),
  type text not null check (type in ('Mission', 'Pillar', 'Objective', 'Program', 'Domain', 'Product/Service', 'Project')),
  purpose text,
  parent_id text references public.atlas_domains(id) deferrable initially deferred,
  circle_id text check (circle_id ~ '^G-[0-9]+$'),
  status text not null check (status in ('Planned', 'Active', 'Completed', 'Retired', 'Needs definition')),
  stage text,
  key_features text,
  target_user text,
  value_proposition text,
  sop_notes text,
  constraint atlas_domains_not_self_parent check (parent_id is null or parent_id <> id)
);
create index atlas_domains_parent_id_idx on public.atlas_domains(parent_id);
create index atlas_domains_circle_id_idx on public.atlas_domains(circle_id);
alter table public.atlas_domains enable row level security;
revoke all on table public.atlas_domains from public, anon, authenticated;
grant select on table public.atlas_domains to anon, authenticated;
grant select, insert, update, delete on table public.atlas_domains to service_role;
create policy atlas_domains_public_read on public.atlas_domains
  for select to anon, authenticated using (true);


set constraints all immediate;
set constraints all deferred;

create table public.atlas_governance (
  id text primary key check (id ~ '^G-[0-9]+$'),
  name text not null check (length(btrim(name)) > 0),
  type text not null check (type in ('Circle', 'Role')),
  parent_circle_id text references public.atlas_governance(id) deferrable initially deferred,
  purpose text,
  accountabilities text,
  scope text,
  privileges text,
  status text not null check (status in ('Planned', 'Active', 'Completed', 'Retired', 'Needs definition')),
  profile_id uuid,
  display_initials text check (display_initials ~ '^[[:alpha:]]{1,2}$' and display_initials = upper(display_initials)),
  definition_note text,
  engagement_level text check (engagement_level in ('Fellow', 'Steward', 'Staff')),
  assignment_basis text,
  constraint atlas_governance_not_self_parent check (parent_circle_id is null or parent_circle_id <> id),
  constraint atlas_governance_person_assignment check (
    num_nonnulls(profile_id, display_initials, engagement_level) in (0, 3)
  )
);
create index atlas_governance_parent_circle_id_idx on public.atlas_governance(parent_circle_id);
create index atlas_governance_profile_id_idx on public.atlas_governance(profile_id);
alter table public.atlas_governance enable row level security;
revoke all on table public.atlas_governance from public, anon, authenticated;
grant select on table public.atlas_governance to anon, authenticated;
grant select, insert, update, delete on table public.atlas_governance to service_role;
create policy atlas_governance_public_read on public.atlas_governance
  for select to anon, authenticated using (true);


alter table public.atlas_domains
  add constraint atlas_domains_circle_id_fkey foreign key (circle_id)
  references public.atlas_governance(id) deferrable initially deferred;

set constraints all immediate;
set constraints all deferred;

create extension if not exists btree_gist with schema extensions;
set local search_path = public, extensions;
create table public.atlas_relationships (
  id text primary key check (id ~ '^R-[0-9]+$'),
  from_domain_id text references public.atlas_domains(id) deferrable initially deferred,
  from_governance_id text references public.atlas_governance(id) deferrable initially deferred,
  relationship text not null check (relationship in ('owns', 'supports', 'succeeds')),
  to_domain_id text references public.atlas_domains(id) deferrable initially deferred,
  to_governance_id text references public.atlas_governance(id) deferrable initially deferred,
  valid_from date,
  valid_until date,
  notes text,
  constraint atlas_relationships_one_endpoint check (
    num_nonnulls(from_domain_id, from_governance_id) = 1
    and num_nonnulls(to_domain_id, to_governance_id) = 1
  ),
  constraint atlas_relationships_direction check (
    (relationship = 'owns' and from_governance_id is not null and to_domain_id is not null)
    or (relationship = 'supports' and from_domain_id is not null and to_domain_id is not null)
    or (relationship = 'succeeds' and (
      (from_domain_id is not null and to_domain_id is not null)
      or (from_governance_id is not null and to_governance_id is not null)
    ))
  ),
  constraint atlas_relationships_not_self check (
    coalesce(from_domain_id, from_governance_id) <> coalesce(to_domain_id, to_governance_id)
  ),
  constraint atlas_relationships_date_order check (
    valid_from is null or valid_until is null or valid_from < valid_until
  ),
  constraint atlas_relationships_finite_dates check (
    (valid_from is null or isfinite(valid_from)) and (valid_until is null or isfinite(valid_until))
  ),
  constraint atlas_relationships_ownership_no_overlap exclude using gist (
    to_domain_id with =,
    daterange(valid_from, valid_until, '[)') with &&
  ) where (relationship = 'owns') deferrable initially deferred
);
create index atlas_relationships_from_domain_id_idx on public.atlas_relationships(from_domain_id);
create index atlas_relationships_from_governance_id_idx on public.atlas_relationships(from_governance_id);
create index atlas_relationships_to_domain_id_idx on public.atlas_relationships(to_domain_id);
create index atlas_relationships_to_governance_id_idx on public.atlas_relationships(to_governance_id);
alter table public.atlas_relationships enable row level security;
revoke all on table public.atlas_relationships from public, anon, authenticated;
grant select on table public.atlas_relationships to anon, authenticated;
grant select, insert, update, delete on table public.atlas_relationships to service_role;
create policy atlas_relationships_public_read on public.atlas_relationships
  for select to anon, authenticated using (true);

create schema if not exists atlas_private;
revoke all on schema atlas_private from public, anon, authenticated;
grant usage on schema atlas_private to service_role;

create function atlas_private.lock_writes()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(714236819::bigint);
  return null;
end;
$$;

create function atlas_private.validate_graph()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.atlas_domains d
    join public.atlas_governance g on g.id = d.circle_id
    where g.type <> 'Circle'
  ) or exists (
    select 1 from public.atlas_governance g
    join public.atlas_governance p on p.id = g.parent_circle_id
    where p.type <> 'Circle'
  ) then
    raise exception 'Atlas circle references must target a Circle' using errcode = '23514';
  end if;

  if exists (
    select 1 from public.atlas_governance
    where profile_id is not null
    group by profile_id
    having count(distinct (display_initials, engagement_level)) > 1
  ) then
    raise exception 'Atlas profile assignments must have consistent initials and engagement levels' using errcode = '23514';
  end if;

  if exists (
    with recursive edges(kind, source, target) as (
      select 'hierarchy', id, parent_id from public.atlas_domains where parent_id is not null
      union all
      select 'hierarchy', id, parent_circle_id from public.atlas_governance where parent_circle_id is not null
      union all
      select 'succession', coalesce(from_domain_id, from_governance_id), coalesce(to_domain_id, to_governance_id)
      from public.atlas_relationships where relationship = 'succeeds'
    ), walk(kind, source, target, path, cycle) as (
      select kind, source, target, array[source], false from edges
      union all
      select w.kind, w.source, e.target, w.path || e.source, e.source = any(w.path)
      from walk w join edges e on e.kind = w.kind and e.source = w.target
      where not w.cycle
    )
    select 1 from walk where cycle
  ) then
    raise exception 'Atlas hierarchies and succession must not contain cycles' using errcode = '23514';
  end if;
  return null;
end;
$$;

revoke all on function atlas_private.lock_writes() from public, anon, authenticated;
revoke all on function atlas_private.validate_graph() from public, anon, authenticated;
grant execute on function atlas_private.lock_writes() to service_role;
grant execute on function atlas_private.validate_graph() to service_role;

create trigger atlas_domains_write_lock before insert or update or delete
on public.atlas_domains for each statement execute function atlas_private.lock_writes();
create trigger atlas_governance_write_lock before insert or update or delete
on public.atlas_governance for each statement execute function atlas_private.lock_writes();
create trigger atlas_relationships_write_lock before insert or update or delete
on public.atlas_relationships for each statement execute function atlas_private.lock_writes();

create constraint trigger atlas_domains_graph_check after insert or update or delete
on public.atlas_domains deferrable initially deferred for each row execute function atlas_private.validate_graph();
create constraint trigger atlas_governance_graph_check after insert or update or delete
on public.atlas_governance deferrable initially deferred for each row execute function atlas_private.validate_graph();
create constraint trigger atlas_relationships_graph_check after insert or update or delete
on public.atlas_relationships deferrable initially deferred for each row execute function atlas_private.validate_graph();


set constraints all immediate;
set constraints all deferred;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;
