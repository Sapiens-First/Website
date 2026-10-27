create table public.member_interests (
  member_id uuid primary key references public.profiles(id) on delete cascade,
  email text not null check (length(btrim(email)) > 0),
  circle boolean not null default false,
  fellowship boolean not null default false,
  created_at timestamptz not null default statement_timestamp()
);
comment on table public.member_interests is 'Member Interests: explicit requests for Circle or Fellowship follow-up; not applications or marketing subscriptions.';
alter table public.member_interests enable row level security;
revoke all on table public.member_interests from public, anon, authenticated;
grant select on table public.member_interests to authenticated;
grant insert (member_id, email, circle, fellowship),
  update (member_id, email, circle, fellowship)
  on public.member_interests to authenticated;
grant all on table public.member_interests to service_role;

create policy member_interests_select_own on public.member_interests
for select to authenticated using ((select auth.uid()) = member_id);
create policy member_interests_insert_own on public.member_interests
for insert to authenticated with check (
  (select auth.uid()) = member_id
  and email = (select auth.jwt() ->> 'email')
  and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'false'
  and exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and length(btrim(p.full_name)) > 0
      and p.country_code ~ '^[A-Z]{2}$'
      and length(btrim(p.city)) > 0
  )
);
create policy member_interests_update_own on public.member_interests
for update to authenticated
using ((select auth.uid()) = member_id)
with check (
  (select auth.uid()) = member_id
  and email = (select auth.jwt() ->> 'email')
  and coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'false'
  and exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and length(btrim(p.full_name)) > 0
      and p.country_code ~ '^[A-Z]{2}$'
      and length(btrim(p.city)) > 0
  )
);
