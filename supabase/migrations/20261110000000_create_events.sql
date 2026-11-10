-- events: one row per user-created community event
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  description text check (char_length(description) <= 2000),
  category text not null check (category in ('workshop', 'meetup', 'sports', 'cultural', 'charity')),
  event_date date not null,
  city text not null check (char_length(city) between 2 and 80),
  venue text check (char_length(venue) <= 120),
  poster_path text check (char_length(poster_path) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_user_date_idx on public.events (user_id, event_date);
create index events_user_category_idx on public.events (user_id, category);

-- Row Level Security: each user sees and changes only their own events
alter table public.events enable row level security;

create policy "Events: owner can read"
  on public.events for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Events: owner can create"
  on public.events for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Events: owner can update"
  on public.events for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Events: owner can delete"
  on public.events for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();
