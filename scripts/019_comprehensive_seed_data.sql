-- Comprehensive seed data for Prana Planner
-- This script populates the database with realistic sample data

-- Insert sample instructors (first create profiles, then instructor records)
-- Note: These will be linked to actual user accounts when they sign up
-- For now, we'll create placeholder instructor records

-- Insert sample classes with various types and difficulty levels
insert into public.classes (name, description, duration_minutes, capacity, difficulty_level, class_type, is_active)
values
  ('Vinyasa Flow', 'Dynamic flowing sequence linking breath with movement. Build strength, flexibility and mindfulness.', 60, 20, 'intermediate', 'Vinyasa', true),
  ('Hatha Basics', 'Traditional yoga focusing on physical postures and breathing techniques. Perfect for beginners.', 75, 15, 'beginner', 'Hatha', true),
  ('Power Yoga', 'Vigorous, fitness-based approach to vinyasa-style yoga. Build strength and stamina.', 60, 18, 'advanced', 'Power', true),
  ('Yin Yoga', 'Slow-paced style with poses held for longer periods. Deep stretching and meditation.', 90, 12, 'all-levels', 'Yin', true),
  ('Restorative Yoga', 'Gentle, relaxing practice using props. Perfect for stress relief and recovery.', 75, 10, 'all-levels', 'Restorative', true),
  ('Hot Yoga', 'Yoga practiced in a heated room. Detoxify and increase flexibility.', 60, 16, 'intermediate', 'Hot', true),
  ('Prenatal Yoga', 'Gentle yoga designed for expecting mothers. Safe and supportive practice.', 60, 10, 'beginner', 'Prenatal', true),
  ('Ashtanga Primary', 'Traditional Ashtanga primary series. Challenging and structured practice.', 90, 15, 'advanced', 'Ashtanga', true),
  ('Gentle Flow', 'Slow-paced vinyasa suitable for all levels. Focus on alignment and breath.', 60, 20, 'beginner', 'Vinyasa', true),
  ('Kundalini Awakening', 'Dynamic breathing techniques, meditation and mantra. Awaken your energy.', 75, 12, 'all-levels', 'Kundalini', true),
  ('Yoga Nidra', 'Guided meditation for deep relaxation. Also known as yogic sleep.', 45, 15, 'all-levels', 'Meditation', true),
  ('Core Power', 'Strengthen your core with targeted poses and sequences.', 45, 18, 'intermediate', 'Power', true)
on conflict do nothing;

-- Insert sample retail products
insert into public.products (name, description, category, price_cents, stock_quantity, sku, is_active, image_url)
values
  ('Premium Yoga Mat', 'Eco-friendly TPE yoga mat with excellent grip and cushioning. 6mm thick.', 'mats', 7900, 25, 'MAT-001', true, '/placeholder.svg?height=400&width=400'),
  ('Cork Yoga Block Set', 'Set of 2 sustainable cork blocks for support and alignment.', 'props', 3900, 40, 'BLOCK-001', true, '/placeholder.svg?height=400&width=400'),
  ('Organic Cotton Strap', '8-foot cotton yoga strap with D-ring closure. Multiple colors available.', 'props', 1900, 50, 'STRAP-001', true, '/placeholder.svg?height=400&width=400'),
  ('Meditation Cushion', 'Zafu meditation cushion filled with buckwheat hulls. Removable cover.', 'props', 5900, 20, 'CUSH-001', true, '/placeholder.svg?height=400&width=400'),
  ('Yoga Mat Bag', 'Canvas yoga mat carrier with adjustable strap and pockets.', 'accessories', 3400, 30, 'BAG-001', true, '/placeholder.svg?height=400&width=400'),
  ('Bamboo Water Bottle', 'Insulated stainless steel bottle with bamboo lid. 24oz capacity.', 'accessories', 2900, 45, 'BOTTLE-001', true, '/placeholder.svg?height=400&width=400'),
  ('Yoga Towel', 'Microfiber non-slip yoga towel. Perfect for hot yoga.', 'accessories', 2400, 35, 'TOWEL-001', true, '/placeholder.svg?height=400&width=400'),
  ('Essential Oil Set', 'Set of 6 essential oils for aromatherapy and relaxation.', 'wellness', 4900, 15, 'OIL-001', true, '/placeholder.svg?height=400&width=400'),
  ('Yoga Pants - Black', 'High-waisted leggings with four-way stretch. Sizes XS-XL.', 'apparel', 6900, 60, 'PANT-001', true, '/placeholder.svg?height=400&width=400'),
  ('Yoga Tank Top', 'Breathable racerback tank in organic cotton. Multiple colors.', 'apparel', 3900, 55, 'TANK-001', true, '/placeholder.svg?height=400&width=400'),
  ('Meditation Timer', 'Digital meditation timer with gentle chime. Multiple interval settings.', 'accessories', 3900, 18, 'TIMER-001', true, '/placeholder.svg?height=400&width=400'),
  ('Yoga Wheel', 'Dharma yoga wheel for backbends and stretching. 12-inch diameter.', 'props', 4900, 22, 'WHEEL-001', true, '/placeholder.svg?height=400&width=400')
on conflict do nothing;

-- Insert sample workshops
insert into public.workshops (
  title, description, instructor_name, event_type, start_date, end_date, 
  start_time, end_time, capacity, price_cents, early_bird_price_cents, 
  early_bird_deadline, location, is_active
)
values
  (
    'Arm Balance Workshop',
    'Master challenging arm balances including crow, side crow, and flying pigeon. Learn proper alignment and build the strength needed for these poses.',
    'Sarah Chen',
    'workshop',
    current_date + interval '14 days',
    current_date + interval '14 days',
    '14:00:00',
    '17:00:00',
    20,
    7500,
    6500,
    current_date + interval '7 days',
    'Main Studio',
    true
  ),
  (
    'Meditation & Mindfulness Retreat',
    'Full-day retreat focusing on meditation techniques, mindful movement, and stress reduction. Includes lunch and materials.',
    'Michael Torres',
    'retreat',
    current_date + interval '21 days',
    current_date + interval '21 days',
    '09:00:00',
    '17:00:00',
    15,
    12900,
    10900,
    current_date + interval '14 days',
    'Retreat Center',
    true
  ),
  (
    'Yoga for Back Pain',
    'Therapeutic workshop addressing common back issues. Learn poses and techniques to alleviate pain and prevent injury.',
    'Dr. Lisa Patel',
    'workshop',
    current_date + interval '10 days',
    current_date + interval '10 days',
    '10:00:00',
    '13:00:00',
    12,
    6500,
    5500,
    current_date + interval '5 days',
    'Main Studio',
    true
  ),
  (
    'Pranayama Deep Dive',
    'Explore advanced breathing techniques and their benefits. Suitable for experienced practitioners.',
    'Raj Kumar',
    'workshop',
    current_date + interval '28 days',
    current_date + interval '28 days',
    '15:00:00',
    '18:00:00',
    18,
    5900,
    4900,
    current_date + interval '21 days',
    'Main Studio',
    true
  ),
  (
    '200-Hour Teacher Training',
    'Comprehensive yoga teacher training program. Weekends over 6 months. Yoga Alliance certified.',
    'Multiple Instructors',
    'teacher-training',
    current_date + interval '60 days',
    current_date + interval '240 days',
    '09:00:00',
    '17:00:00',
    12,
    349900,
    329900,
    current_date + interval '45 days',
    'Main Studio',
    true
  )
on conflict do nothing;

-- Insert sample locations
insert into public.locations (name, address, city, state, zip_code, phone, is_active)
values
  ('Downtown Studio', '123 Main Street', 'Portland', 'OR', '97201', '(503) 555-0100', true),
  ('Eastside Studio', '456 Burnside Ave', 'Portland', 'OR', '97214', '(503) 555-0101', true),
  ('Westside Studio', '789 Canyon Road', 'Portland', 'OR', '97225', '(503) 555-0102', true)
on conflict do nothing;

-- Insert sample rooms
insert into public.rooms (name, location_id, capacity, amenities, is_active)
select 
  'Main Studio', 
  id, 
  25, 
  array['Heated Floor', 'Sound System', 'Props Storage', 'Natural Light'],
  true
from public.locations where name = 'Downtown Studio'
union all
select 
  'Hot Room', 
  id, 
  20, 
  array['Infrared Heating', 'Humidity Control', 'Ventilation System'],
  true
from public.locations where name = 'Downtown Studio'
union all
select 
  'Meditation Room', 
  id, 
  15, 
  array['Dim Lighting', 'Cushions', 'Quiet Space', 'Aromatherapy'],
  true
from public.locations where name = 'Downtown Studio'
on conflict do nothing;

-- Note: To create actual class schedules and instances, you'll need to:
-- 1. First create instructor profiles by signing up users
-- 2. Link those users to instructor records
-- 3. Then create schedules and instances with proper instructor_id references

-- For now, let's create some schedules without instructor assignments
-- Admins can assign instructors later through the UI

-- Sample class schedules (recurring weekly classes)
-- These will need instructor_id to be updated after instructors are created
insert into public.class_schedules (class_id, day_of_week, start_time, end_time, room, is_active)
select 
  c.id,
  1, -- Monday
  '06:00:00',
  '07:00:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Vinyasa Flow'
union all
select 
  c.id,
  1, -- Monday
  '18:00:00',
  '19:15:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Hatha Basics'
union all
select 
  c.id,
  2, -- Tuesday
  '06:30:00',
  '07:30:00',
  'Hot Room',
  true
from public.classes c where c.name = 'Hot Yoga'
union all
select 
  c.id,
  2, -- Tuesday
  '19:00:00',
  '20:30:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Yin Yoga'
union all
select 
  c.id,
  3, -- Wednesday
  '12:00:00',
  '13:00:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Gentle Flow'
union all
select 
  c.id,
  3, -- Wednesday
  '18:30:00',
  '19:30:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Power Yoga'
union all
select 
  c.id,
  4, -- Thursday
  '10:00:00',
  '11:00:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Prenatal Yoga'
union all
select 
  c.id,
  4, -- Thursday
  '19:00:00',
  '20:30:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Ashtanga Primary'
union all
select 
  c.id,
  5, -- Friday
  '06:00:00',
  '07:00:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Vinyasa Flow'
union all
select 
  c.id,
  5, -- Friday
  '17:30:00',
  '18:45:00',
  'Meditation Room',
  true
from public.classes c where c.name = 'Restorative Yoga'
union all
select 
  c.id,
  6, -- Saturday
  '09:00:00',
  '10:15:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Kundalini Awakening'
union all
select 
  c.id,
  6, -- Saturday
  '11:00:00',
  '11:45:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Core Power'
union all
select 
  c.id,
  0, -- Sunday
  '10:00:00',
  '11:30:00',
  'Main Studio',
  true
from public.classes c where c.name = 'Hatha Basics'
union all
select 
  c.id,
  0, -- Sunday
  '17:00:00',
  '17:45:00',
  'Meditation Room',
  true
from public.classes c where c.name = 'Yoga Nidra'
on conflict do nothing;
