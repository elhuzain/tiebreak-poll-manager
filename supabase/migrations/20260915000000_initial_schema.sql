-- Tiebreak initial schema. Apply with Supabase migrations or the SQL editor.
-- Shared UUID links are access-by-link; do not expose a public poll-list endpoint.

create extension if not exists pgcrypto with schema extensions;

create type public.poll_status as enum ('open', 'settled');
create type public.option_source as enum ('creator', 'suggestion');
create type public.suggestion_status as enum ('pending', 'approved', 'declined');

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 200),
  max_choices smallint not null default 1 check (max_choices between 1 and 10),
  suggestions_enabled boolean not null default false,
  closes_at timestamptz not null,
  status public.poll_status not null default 'open',
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'open' and settled_at is null) or
         (status = 'settled' and settled_at is not null))
);

create table public.options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  label text not null check (length(btrim(label)) between 1 and 200),
  display_order integer not null check (display_order >= 0),
  source public.option_source not null,
  suggestion_status public.suggestion_status,
  suggester_name text,
  suggester_avatar_seed text,
  suggester_avatar_tint text,
  created_at timestamptz not null default now(),
  unique (poll_id, id),
  check (
    (source = 'creator' and suggestion_status is null and
     suggester_name is null and suggester_avatar_seed is null and
     suggester_avatar_tint is null)
    or
    (source = 'suggestion' and suggestion_status is not null and
     length(btrim(suggester_name)) between 1 and 80 and
     length(btrim(suggester_avatar_seed)) between 1 and 200 and
     suggester_avatar_tint in ('f8c9b9', 'cbe2d8', 'f6e0a4', 'e3d2f2'))
  )
);

create index options_poll_order_idx on public.options (poll_id, display_order, created_at);
create index options_pending_idx on public.options (poll_id)
  where suggestion_status = 'pending';

create table public.ballots (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  voter_token_hash text not null check (length(voter_token_hash) = 64),
  voter_name text not null check (length(btrim(voter_name)) between 1 and 80),
  voter_avatar_seed text not null check (length(btrim(voter_avatar_seed)) between 1 and 200),
  voter_avatar_tint text not null check
    (voter_avatar_tint in ('f8c9b9', 'cbe2d8', 'f6e0a4', 'e3d2f2')),
  cast_at timestamptz not null default now(),
  unique (poll_id, id),
  unique (poll_id, voter_token_hash)
);

create index ballots_poll_cast_idx on public.ballots (poll_id, cast_at);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null,
  ballot_id uuid not null,
  option_id uuid not null,
  foreign key (poll_id, ballot_id) references public.ballots(poll_id, id) on delete cascade,
  foreign key (poll_id, option_id) references public.options(poll_id, id) on delete cascade,
  unique (ballot_id, option_id)
);

create index votes_poll_option_idx on public.votes (poll_id, option_id);

-- A ballot is inserted atomically with all its votes. Existing tokens are
-- idempotent only when the submitted choice set matches the original.
create or replace function public.cast_ballot(
  p_poll_id uuid,
  p_option_ids uuid[],
  p_voter_token text,
  p_voter_name text,
  p_avatar_seed text,
  p_avatar_tint text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_poll public.polls%rowtype;
  v_ballot_id uuid;
  v_token_hash text;
  v_count integer;
  v_existing_options uuid[];
begin
  if p_voter_token is null or length(p_voter_token) < 32 or
     length(p_voter_token) > 256 then
    raise exception 'Invalid voter token';
  end if;

  v_token_hash := encode(extensions.digest(p_voter_token, 'sha256'), 'hex');

  -- Serializes casts and closing/moderation operations for this small poll.
  select * into v_poll from public.polls where id = p_poll_id for update;
  if not found then raise exception 'Poll not found'; end if;

  select id into v_ballot_id from public.ballots
    where poll_id = p_poll_id and voter_token_hash = v_token_hash;
  if found then
    select array_agg(option_id order by option_id) into v_existing_options
      from public.votes where ballot_id = v_ballot_id;
    if v_existing_options =
       (select array_agg(x order by x) from unnest(p_option_ids) as x) then
      return v_ballot_id;
    end if;
    raise exception 'This browser has already voted on this poll';
  end if;

  if v_poll.status <> 'open' or v_poll.closes_at <= now() then
    raise exception 'Voting has closed';
  end if;

  v_count := coalesce(array_length(p_option_ids, 1), 0);
  if v_count < 1 or v_count > v_poll.max_choices or
     (select count(distinct x) from unnest(p_option_ids) as x) <> v_count or
     (select count(*) from unnest(p_option_ids) as x where x is null) > 0 then
    raise exception 'Invalid selection';
  end if;

  if (select count(*) from public.options
      where poll_id = p_poll_id and id = any(p_option_ids)
        and (source = 'creator' or suggestion_status = 'approved')) <> v_count then
    raise exception 'Selection contains an unavailable option';
  end if;

  insert into public.ballots
    (poll_id, voter_token_hash, voter_name, voter_avatar_seed, voter_avatar_tint)
  values (p_poll_id, v_token_hash, p_voter_name, p_avatar_seed, p_avatar_tint)
  returning id into v_ballot_id;

  insert into public.votes (poll_id, ballot_id, option_id)
  select p_poll_id, v_ballot_id, x from unnest(p_option_ids) as x;

  return v_ballot_id;
end;
$$;

-- Public callers may cast, but cannot insert or inspect raw vote rows.
revoke execute on function public.cast_ballot(uuid, uuid[], text, text, text, text)
  from public;
grant execute on function public.cast_ballot(uuid, uuid[], text, text, text, text)
  to anon, authenticated;

create or replace function public.end_voting(p_poll_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.polls set status = 'settled', settled_at = now(), updated_at = now()
    where id = p_poll_id and creator_id = auth.uid() and status = 'open';
  if not found then raise exception 'Poll is unavailable or already settled'; end if;
end;
$$;

-- Settle expired polls on demand from a server read, or invoke from a job.
create or replace function public.settle_due_poll(p_poll_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.polls
    set status = 'settled', settled_at = closes_at, updated_at = now()
    where id = p_poll_id and status = 'open' and closes_at <= now();
end;
$$;

-- Reopening always supplies a new future deadline. The application should
-- show a confirmation step before calling this function.
create or replace function public.reopen_poll(
  p_poll_id uuid, p_new_closes_at timestamptz
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_new_closes_at is null or p_new_closes_at <= now() then
    raise exception 'A future closing time is required';
  end if;
  update public.polls
    set status = 'open', settled_at = null, closes_at = p_new_closes_at,
        updated_at = now()
    where id = p_poll_id and creator_id = auth.uid() and status = 'settled';
  if not found then raise exception 'Poll is unavailable or still open'; end if;
end;
$$;

create or replace function public.moderate_suggestion(
  p_option_id uuid, p_decision public.suggestion_status
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_decision not in ('approved', 'declined') then
    raise exception 'Decision must be approved or declined';
  end if;
  update public.options o set suggestion_status = p_decision
    from public.polls p
    where o.id = p_option_id and o.poll_id = p.id
      and p.creator_id = auth.uid() and p.status = 'open'
      and p.closes_at > now() and o.source = 'suggestion'
      and o.suggestion_status = 'pending';
  if not found then raise exception 'Suggestion is unavailable or already decided'; end if;
end;
$$;

-- Declines remain recoverable for the UI's Undo action. Approval is final.
create or replace function public.undo_decline(p_option_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.options o set suggestion_status = 'pending'
    from public.polls p
    where o.id = p_option_id and o.poll_id = p.id
      and p.creator_id = auth.uid() and p.status = 'open'
      and p.closes_at > now() and o.source = 'suggestion'
      and o.suggestion_status = 'declined';
  if not found then raise exception 'Decline cannot be undone'; end if;
end;
$$;

revoke execute on function public.end_voting(uuid) from public;
revoke execute on function public.settle_due_poll(uuid) from public;
revoke execute on function public.reopen_poll(uuid, timestamptz) from public;
revoke execute on function public.moderate_suggestion(uuid, public.suggestion_status) from public;
revoke execute on function public.undo_decline(uuid) from public;
grant execute on function public.end_voting(uuid) to authenticated;
grant execute on function public.settle_due_poll(uuid) to service_role;
grant execute on function public.reopen_poll(uuid, timestamptz) to authenticated;
grant execute on function public.moderate_suggestion(uuid, public.suggestion_status)
  to authenticated;
grant execute on function public.undo_decline(uuid) to authenticated;

alter table public.polls enable row level security;
alter table public.options enable row level security;
alter table public.ballots enable row level security;
alter table public.votes enable row level security;

-- Creator management reads. Public poll/option reads and result counts should
-- go through scoped server endpoints (or separate, carefully written RPCs).
create policy "Creators read their polls" on public.polls for select
  to authenticated using (creator_id = (select auth.uid()));

create policy "Creators read their options" on public.options for select
  to authenticated using (
    exists (select 1 from public.polls p
            where p.id = poll_id and p.creator_id = (select auth.uid()))
  );

-- No direct ballots/votes policies: even creators only see counts while open.
-- Keep the service-role key on the server. Never return raw voter rows from
-- a public endpoint until the effective poll state is settled.
