-- Add permissions table for granular access control
create table if not exists public.role_permissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  permission text not null check (permission in (
    'view_finances',
    'manage_finances',
    'view_staff',
    'manage_staff',
    'view_analytics',
    'manage_classes',
    'manage_memberships',
    'manage_clients',
    'view_reports'
  )),
  granted_by uuid references public.profiles(id),
  granted_at timestamptz default now(),
  unique(user_id, permission)
);

-- Enable RLS
alter table public.role_permissions enable row level security;

-- RLS Policies
create policy "Admins can view all permissions"
  on public.role_permissions for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can manage permissions"
  on public.role_permissions for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Create index
create index idx_role_permissions_user_id on public.role_permissions(user_id);
