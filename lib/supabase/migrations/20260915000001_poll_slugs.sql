begin;

alter table public.polls add column if not exists slug text;

update public.polls
set slug = replace(gen_random_uuid()::text, '-', '')
where slug is null;

alter table public.polls
  alter column slug set default replace(gen_random_uuid()::text, '-', ''),
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.polls'::regclass and conname = 'polls_slug_format'
  ) then
    alter table public.polls
      add constraint polls_slug_format check (slug ~ '^[0-9a-f]{32}$');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.polls'::regclass and conname = 'polls_slug_unique'
  ) then
    alter table public.polls add constraint polls_slug_unique unique (slug);
  end if;
end;
$$;

commit;
