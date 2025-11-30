-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('admin', 'instructor', 'client')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create instructors table
create table if not exists public.instructors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  bio text,
  specialties text[],
  certifications text[],
  photo_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create classes table
create table if not exists public.classes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  instructor_id uuid references public.instructors(id) on delete set null,
  duration_minutes integer not null,
  capacity integer not null,
  difficulty_level text check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'all-levels')),
  class_type text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create class schedules table (for recurring classes)
create table if not exists public.class_schedules (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid references public.classes(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday, 6 = Saturday
  start_time time not null,
  end_time time not null,
  room text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create class instances table (actual class occurrences)
create table if not exists public.class_instances (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid references public.classes(id) on delete cascade,
  instructor_id uuid references public.instructors(id) on delete set null,
  scheduled_date date not null,
  start_time time not null,
  end_time time not null,
  room text,
  capacity integer not null,
  status text default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create membership types table
create table if not exists public.membership_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  type text not null check (type in ('unlimited', 'class-pack')),
  class_count integer, -- null for unlimited, number for class packs
  price_cents integer not null,
  validity_days integer not null, -- how long the membership is valid
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create memberships table (user purchases)
create table if not exists public.memberships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  membership_type_id uuid references public.membership_types(id) on delete restrict,
  classes_remaining integer, -- null for unlimited
  start_date date not null,
  end_date date not null,
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  stripe_payment_intent_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create bookings table
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  class_instance_id uuid references public.class_instances(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete set null,
  status text default 'confirmed' check (status in ('confirmed', 'cancelled', 'attended', 'no-show')),
  booked_at timestamptz default now(),
  cancelled_at timestamptz,
  checked_in_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, class_instance_id)
);

-- Create waitlist table
create table if not exists public.waitlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  class_instance_id uuid references public.class_instances(id) on delete cascade,
  position integer not null,
  status text default 'waiting' check (status in ('waiting', 'notified', 'converted', 'expired')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, class_instance_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.classes enable row level security;
alter table public.class_schedules enable row level security;
alter table public.class_instances enable row level security;
alter table public.membership_types enable row level security;
alter table public.memberships enable row level security;
alter table public.bookings enable row level security;
alter table public.waitlist enable row level security;

-- RLS Policies for profiles
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for instructors
create policy "Anyone can view active instructors"
  on public.instructors for select
  using (is_active = true);

create policy "Admins can manage instructors"
  on public.instructors for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for classes
create policy "Anyone can view active classes"
  on public.classes for select
  using (is_active = true);

create policy "Admins can manage classes"
  on public.classes for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for class_schedules
create policy "Anyone can view active schedules"
  on public.class_schedules for select
  using (is_active = true);

create policy "Admins can manage schedules"
  on public.class_schedules for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for class_instances
create policy "Anyone can view scheduled instances"
  on public.class_instances for select
  using (status = 'scheduled');

create policy "Admins can manage instances"
  on public.class_instances for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for membership_types
create policy "Anyone can view active membership types"
  on public.membership_types for select
  using (is_active = true);

create policy "Admins can manage membership types"
  on public.membership_types for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for memberships
create policy "Users can view own memberships"
  on public.memberships for select
  using (auth.uid() = user_id);

create policy "Users can insert own memberships"
  on public.memberships for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all memberships"
  on public.memberships for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for bookings
create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can cancel own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Admins can view all bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can manage all bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS Policies for waitlist
create policy "Users can view own waitlist entries"
  on public.waitlist for select
  using (auth.uid() = user_id);

create policy "Users can create own waitlist entries"
  on public.waitlist for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all waitlist entries"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Create indexes for performance
create index idx_profiles_role on public.profiles(role);
create index idx_instructors_user_id on public.instructors(user_id);
create index idx_classes_instructor_id on public.classes(instructor_id);
create index idx_class_instances_date on public.class_instances(scheduled_date);
create index idx_class_instances_class_id on public.class_instances(class_id);
create index idx_memberships_user_id on public.memberships(user_id);
create index idx_memberships_status on public.memberships(status);
create index idx_bookings_user_id on public.bookings(user_id);
create index idx_bookings_class_instance_id on public.bookings(class_instance_id);
create index idx_waitlist_class_instance_id on public.waitlist(class_instance_id);
