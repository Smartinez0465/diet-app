-- Run this in Supabase: Project > SQL Editor > New query

create table if not exists food_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) not null,
  food_name text not null,
  grams numeric not null,
  calories int not null,
  protein int default 0,
  carbs int default 0,
  fat int default 0,
  logged_at timestamptz not null default now()
);

alter table food_logs enable row level security;

create policy "Users can view own logs"
  on food_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on food_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own logs"
  on food_logs for delete
  using (auth.uid() = user_id);
