-- Revisa: metas com matérias e sessões diárias persistentes.

alter table public.revisa_goals
  add column if not exists subjects jsonb not null default '[]'::jsonb,
  add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname='revisa_goals_status_check'
      and conrelid='public.revisa_goals'::regclass
  ) then
    alter table public.revisa_goals
      add constraint revisa_goals_status_check
      check (status in ('active','completed','archived'));
  end if;
end $$;

create table if not exists public.revisa_study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.revisa_goals(id) on delete cascade,
  scheduled_date date not null,
  subject text not null check (char_length(trim(subject)) between 1 and 100),
  planned_minutes integer not null check (planned_minutes between 5 and 240),
  completed_minutes integer not null default 0 check (completed_minutes between 0 and 240),
  status text not null default 'planned' check (status in ('planned','completed','skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists revisa_sessions_user_date_idx
  on public.revisa_study_sessions(user_id, scheduled_date);
create index if not exists revisa_sessions_goal_date_idx
  on public.revisa_study_sessions(goal_id, scheduled_date);
create index if not exists revisa_attempts_user_goal_idx
  on public.revisa_attempts(user_id, goal_id, created_at desc);

alter table public.revisa_study_sessions enable row level security;
grant select, insert, update, delete on public.revisa_study_sessions to authenticated;

drop policy if exists "revisa_study_sessions_owner_all" on public.revisa_study_sessions;
create policy "revisa_study_sessions_owner_all"
on public.revisa_study_sessions
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.revisa_goals to authenticated;
grant select, insert, update, delete on public.revisa_attempts to authenticated;
grant select on public.revisa_questions to anon, authenticated;

create unique index if not exists revisa_questions_subject_topic_statement_uidx
  on public.revisa_questions(subject, coalesce(topic,''), statement);
