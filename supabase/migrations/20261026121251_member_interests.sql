create table public.member_interests (
  interest text not null check (interest in ('start-a-circle', 'fellowship')),
  email text not null check (char_length(email) <= 254 and email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  created_at timestamptz not null default statement_timestamp(),
  primary key (interest, email)
);

alter table public.member_interests enable row level security;
revoke all on public.member_interests from public, anon, authenticated;
grant all on public.member_interests to service_role;

create schema if not exists interest_private;
grant usage on schema interest_private to anon, authenticated;

create function interest_private.register_interest(topic text, contact_email text)
returns void
language sql security definer set search_path = ''
as $$
  insert into public.member_interests (interest, email)
  values (topic, lower(btrim(contact_email)))
  on conflict (interest, email) do nothing;
$$;
revoke all on function interest_private.register_interest(text, text) from public;
grant execute on function interest_private.register_interest(text, text) to anon, authenticated;

create function public.register_interest(topic text, contact_email text)
returns void
language sql security invoker set search_path = ''
as $$ select interest_private.register_interest(topic, contact_email); $$;
revoke all on function public.register_interest(text, text) from public;
grant execute on function public.register_interest(text, text) to anon, authenticated;
