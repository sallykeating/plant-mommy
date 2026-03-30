-- Plant Mommy Database Schema
-- Run this in your Supabase SQL Editor to set up all tables

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Plants
create table if not exists plants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  species text,
  cultivar text,
  emoji text default '🌿',
  photo_url text,
  acquisition_date date,
  location text,
  pot_size text,
  pot_type text,
  last_repotted date,
  sunlight_preference text check (sunlight_preference in ('full_sun', 'partial_sun', 'bright_indirect', 'medium_indirect', 'low_light', 'shade')),
  current_light_exposure text check (current_light_exposure in ('full_sun', 'partial_sun', 'bright_indirect', 'medium_indirect', 'low_light', 'shade')),
  watering_frequency_days integer,
  fertilizing_frequency_days integer,
  humidity_preference text check (humidity_preference in ('low', 'medium', 'high', 'very_high')),
  health_status text default 'healthy' check (health_status in ('thriving', 'healthy', 'fair', 'struggling', 'critical')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table plants enable row level security;
create policy "Users can CRUD own plants" on plants for all using (auth.uid() = user_id);

create index idx_plants_user_id on plants(user_id);

-- Care Reminders
create table if not exists care_reminders (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants on delete cascade not null,
  care_type text not null check (care_type in ('watering', 'fertilizing', 'misting', 'repotting', 'pruning', 'rotating', 'cleaning', 'other')),
  frequency_days integer not null default 7,
  next_due date not null,
  last_completed timestamptz,
  is_active boolean default true not null,
  notes text,
  created_at timestamptz default now() not null
);

alter table care_reminders enable row level security;
create policy "Users can manage own reminders" on care_reminders for all
  using (plant_id in (select id from plants where user_id = auth.uid()));

create index idx_care_reminders_plant_id on care_reminders(plant_id);
create index idx_care_reminders_next_due on care_reminders(next_due);

-- Care Events (log of performed actions)
create table if not exists care_events (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants on delete cascade not null,
  care_type text not null check (care_type in ('watering', 'fertilizing', 'misting', 'repotting', 'pruning', 'rotating', 'cleaning', 'other')),
  performed_at timestamptz default now() not null,
  amount text,
  notes text,
  created_at timestamptz default now() not null
);

alter table care_events enable row level security;
create policy "Users can manage own care events" on care_events for all
  using (plant_id in (select id from plants where user_id = auth.uid()));

create index idx_care_events_plant_id on care_events(plant_id);

-- Growth Measurements
create table if not exists growth_measurements (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants on delete cascade not null,
  measured_at date default current_date not null,
  height_cm numeric(8,2),
  width_cm numeric(8,2),
  leaf_count integer,
  is_flowering boolean default false,
  new_growth_count integer,
  notes text,
  photo_url text,
  created_at timestamptz default now() not null
);

alter table growth_measurements enable row level security;
create policy "Users can manage own measurements" on growth_measurements for all
  using (plant_id in (select id from plants where user_id = auth.uid()));

create index idx_growth_measurements_plant_id on growth_measurements(plant_id);

-- Plant Photos
create table if not exists plant_photos (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants on delete cascade not null,
  url text not null,
  caption text,
  taken_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

alter table plant_photos enable row level security;
create policy "Users can manage own photos" on plant_photos for all
  using (plant_id in (select id from plants where user_id = auth.uid()));

create index idx_plant_photos_plant_id on plant_photos(plant_id);

-- Health Issues
create table if not exists health_issues (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants on delete cascade not null,
  issue_type text not null check (issue_type in ('pest', 'disease', 'overwatering', 'underwatering', 'sunburn', 'nutrient_deficiency', 'root_rot', 'drooping', 'yellowing', 'leaf_drop', 'spots', 'other')),
  severity text default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  description text not null,
  treatment text,
  resolved boolean default false,
  started_at date default current_date not null,
  resolved_at date,
  notes text,
  created_at timestamptz default now() not null
);

alter table health_issues enable row level security;
create policy "Users can manage own health issues" on health_issues for all
  using (plant_id in (select id from plants where user_id = auth.uid()));

create index idx_health_issues_plant_id on health_issues(plant_id);

-- Environment Notes
create table if not exists environment_notes (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants on delete cascade not null,
  room text,
  light_direction text,
  temperature_f numeric(5,1),
  humidity_percent numeric(5,1),
  season text,
  notes text,
  recorded_at date default current_date not null,
  created_at timestamptz default now() not null
);

alter table environment_notes enable row level security;
create policy "Users can manage own environment notes" on environment_notes for all
  using (plant_id in (select id from plants where user_id = auth.uid()));

create index idx_environment_notes_plant_id on environment_notes(plant_id);

-- Auto-update updated_at on plants
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger plants_updated_at
  before update on plants
  for each row execute function update_updated_at();

-- Storage bucket for plant photos
insert into storage.buckets (id, name, public) values ('plant-photos', 'plant-photos', true)
on conflict do nothing;

create policy "Authenticated users can upload photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'plant-photos');

create policy "Anyone can view photos" on storage.objects
  for select using (bucket_id = 'plant-photos');

create policy "Users can delete own photos" on storage.objects
  for delete to authenticated using (bucket_id = 'plant-photos');
