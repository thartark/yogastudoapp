-- Script to make a user an admin
-- Replace 'your-email@example.com' with your actual email address

-- Update the user's role to admin
update public.profiles
set role = 'admin', full_name = 'Admin User'
where email = 'your-email@example.com';

-- If you want to make the first registered user an admin instead:
-- update public.profiles
-- set role = 'admin', full_name = 'Admin User'
-- where id = (select id from public.profiles order by created_at asc limit 1);
