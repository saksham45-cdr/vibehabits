-- Migration: milk_entries table for "Doodh ka Hisaab" feature

create table milk_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  status text check (status in ('taken', 'skipped')) not null,
  litres decimal(5,2) default null,
  created_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table milk_entries enable row level security;

create policy "Users can manage own milk entries"
  on milk_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
