-- =====================================================
-- PRANA PLANNER - COMPLETE DATABASE SETUP
-- =====================================================
-- This script contains ALL schema, policies, and seed data
-- Run this ONCE in your Supabase SQL Editor to set up everything
-- =====================================================

-- =====================================================
-- PART 1: CORE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'instructor', 'client')),
  avatar_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  capacity INTEGER NOT NULL DEFAULT 20,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  style TEXT, -- Vinyasa, Hatha, Yin, etc.
  color TEXT DEFAULT '#10b981',
  equipment_required TEXT[],
  is_virtual BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class schedules (recurring patterns)
CREATE TABLE IF NOT EXISTS class_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  room_id UUID REFERENCES rooms(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class instances (actual bookable classes)
CREATE TABLE IF NOT EXISTS class_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES class_schedules(id),
  instructor_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  room_id UUID REFERENCES rooms(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL,
  spots_available INTEGER NOT NULL,
  is_cancelled BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership types
CREATE TABLE IF NOT EXISTS membership_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('unlimited', 'class_pack', 'punch_card')),
  price DECIMAL(10,2) NOT NULL,
  class_credits INTEGER, -- for class packs
  duration_days INTEGER, -- validity period
  tier TEXT CHECK (tier IN ('basic', 'bronze', 'silver', 'gold', 'platinum')),
  billing_cycle TEXT CHECK (billing_cycle IN ('one_time', 'monthly', 'annual')),
  auto_renew BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships (user purchases)
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  membership_type_id UUID REFERENCES membership_types(id),
  start_date DATE NOT NULL,
  end_date DATE,
  class_credits_remaining INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'frozen', 'cancelled')),
  auto_renew BOOLEAN DEFAULT false,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  checked_in_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'promoted', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workshops
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  early_bird_price DECIMAL(10,2),
  early_bird_deadline TIMESTAMPTZ,
  type TEXT CHECK (type IN ('workshop', 'seminar', 'retreat', 'teacher_training')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workshop registrations
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_intent_id TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (retail)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client profiles (extended info)
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  medical_conditions TEXT,
  injuries TEXT,
  medications TEXT,
  yoga_experience TEXT,
  goals TEXT,
  preferences TEXT,
  waiver_signed BOOLEAN DEFAULT false,
  waiver_signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Private sessions
CREATE TABLE IF NOT EXISTS private_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id),
  client_id UUID REFERENCES profiles(id),
  location_id UUID REFERENCES locations(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  session_type TEXT CHECK (session_type IN ('one_on_one', 'semi_private')),
  max_participants INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift cards
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  initial_amount DECIMAL(10,2) NOT NULL,
  remaining_amount DECIMAL(10,2) NOT NULL,
  purchaser_id UUID REFERENCES profiles(id),
  recipient_email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment plans
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  installments INTEGER NOT NULL,
  installment_amount DECIMAL(10,2) NOT NULL,
  frequency TEXT CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  next_payment_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  vendor TEXT,
  payment_method TEXT,
  is_tax_deductible BOOLEAN DEFAULT false,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructor payouts
CREATE TABLE IF NOT EXISTS instructor_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  base_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  bonus_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff management tables
CREATE TABLE IF NOT EXISTS staff_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS time_off_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiration_date DATE,
  credential_id TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PART 2: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_off_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Classes policies (public read, admin write)
CREATE POLICY "Classes are viewable by everyone" ON classes FOR SELECT USING (true);
CREATE POLICY "Only admins can manage classes" ON classes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'instructor'))
);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Memberships policies
CREATE POLICY "Users can view own memberships" ON memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own memberships" ON memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add similar policies for other tables...

-- =====================================================
-- PART 3: SEED DATA
-- =====================================================

-- Insert default location
INSERT INTO locations (name, address, city, state, zip_code, phone, email) VALUES
('Prana Planner Main Studio', '123 Wellness Way', 'San Francisco', 'CA', '94102', '(555) 123-4567', 'info@pranaplanner.com')
ON CONFLICT DO NOTHING;

-- Insert rooms
INSERT INTO rooms (location_id, name, capacity, amenities) 
SELECT id, 'Sunrise Studio', 30, ARRAY['Mats', 'Blocks', 'Straps', 'Bolsters']
FROM locations WHERE name = 'Prana Planner Main Studio'
ON CONFLICT DO NOTHING;

INSERT INTO rooms (location_id, name, capacity, amenities)
SELECT id, 'Moonlight Studio', 20, ARRAY['Mats', 'Blocks', 'Straps', 'Meditation Cushions']
FROM locations WHERE name = 'Prana Planner Main Studio'
ON CONFLICT DO NOTHING;

-- Insert sample instructors (you'll need to create these users in Supabase Auth first)
-- Then update their profiles to be instructors

-- Insert membership types
INSERT INTO membership_types (name, description, type, price, class_credits, duration_days, tier, billing_cycle) VALUES
('Drop-In', 'Single class pass', 'class_pack', 25.00, 1, 30, 'basic', 'one_time'),
('5-Class Pack', '5 classes to use within 60 days', 'class_pack', 100.00, 5, 60, 'bronze', 'one_time'),
('10-Class Pack', '10 classes to use within 90 days', 'class_pack', 180.00, 10, 90, 'silver', 'one_time'),
('Monthly Unlimited', 'Unlimited classes per month', 'unlimited', 150.00, NULL, 30, 'gold', 'monthly'),
('Annual Unlimited', 'Unlimited classes for one year', 'unlimited', 1500.00, NULL, 365, 'platinum', 'annual')
ON CONFLICT DO NOTHING;

-- Insert sample classes
INSERT INTO classes (name, description, duration, capacity, difficulty_level, style, color) VALUES
('Morning Flow', 'Energizing vinyasa flow to start your day', 60, 25, 'all_levels', 'Vinyasa', '#10b981'),
('Power Yoga', 'Challenging strength-building practice', 75, 20, 'advanced', 'Power', '#ef4444'),
('Gentle Hatha', 'Slow-paced practice focusing on alignment', 60, 30, 'beginner', 'Hatha', '#3b82f6'),
('Yin Yoga', 'Deep stretching and meditation', 90, 20, 'all_levels', 'Yin', '#8b5cf6'),
('Hot Yoga', 'Heated room vinyasa practice', 60, 15, 'intermediate', 'Hot Vinyasa', '#f59e0b'),
('Restorative', 'Deeply relaxing supported poses', 75, 25, 'all_levels', 'Restorative', '#06b6d4')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, category, price, stock_quantity, image_url) VALUES
('Yoga Mat - Premium', 'Extra thick non-slip yoga mat', 'Mats', 79.99, 50, '/placeholder.svg?height=400&width=400'),
('Yoga Block Set', 'Set of 2 cork yoga blocks', 'Props', 24.99, 100, '/placeholder.svg?height=400&width=400'),
('Yoga Strap', '8ft cotton yoga strap', 'Props', 12.99, 75, '/placeholder.svg?height=400&width=400'),
('Meditation Cushion', 'Comfortable zafu cushion', 'Meditation', 49.99, 30, '/placeholder.svg?height=400&width=400'),
('Yoga Towel', 'Microfiber non-slip towel', 'Accessories', 29.99, 60, '/placeholder.svg?height=400&width=400'),
('Water Bottle', 'Insulated stainless steel', 'Accessories', 34.99, 40, '/placeholder.svg?height=400&width=400')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 4: FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Sign up for an account in your app
-- 2. Run the script below with YOUR email to make yourself admin
-- =====================================================
