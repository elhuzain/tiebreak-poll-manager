begin;

alter table public.polls add column slug text;

update public.polls
set slug = replace(gen_random_uuid()::text, '-', '')
where slug is null;

alter table public.polls
  alter column slug set default replace(gen_random_uuid()::text, '-', ''),
  alter column slug set not null;

alter table public.polls
  add constraint polls_slug_format check (slug ~ '^[0-9a-f]{32}$'),
  add constraint polls_slug_unique unique (slug);

commit;
