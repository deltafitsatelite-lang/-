-- MoveLingo initial schema (for future cloud sync)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  fitness_goal text,
  exercise_experience text,
  daily_time_minutes int,
  concern_area text,
  coach_tone text,
  notifications_enabled boolean default false,
  notification_time text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_xp int not null default 0,
  streak_days int not null default 0,
  last_completed_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.completed_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  xp_gained int not null default 0,
  duration_minutes int,
  note text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.completed_lessons enable row level security;
alter table public.workout_logs enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_upsert_own" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "progress_select_own" on public.user_progress
for select using (auth.uid() = user_id);
create policy "progress_write_own" on public.user_progress
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "completed_select_own" on public.completed_lessons
for select using (auth.uid() = user_id);
create policy "completed_write_own" on public.completed_lessons
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "logs_select_own" on public.workout_logs
for select using (auth.uid() = user_id);
create policy "logs_write_own" on public.workout_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
