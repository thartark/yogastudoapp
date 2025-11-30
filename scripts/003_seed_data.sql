-- Insert sample membership types
insert into public.membership_types (name, description, type, class_count, price_cents, validity_days, is_active)
values
  ('Unlimited Monthly', 'Unlimited classes for 30 days', 'unlimited', null, 12900, 30, true),
  ('10 Class Pack', '10 classes valid for 60 days', 'class-pack', 10, 9900, 60, true),
  ('5 Class Pack', '5 classes valid for 30 days', 'class-pack', 5, 5900, 30, true),
  ('Single Drop-in', 'Single class drop-in', 'class-pack', 1, 2000, 7, true)
on conflict do nothing;
