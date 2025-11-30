-- Create workshops/events table
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  workshop_type TEXT NOT NULL CHECK (workshop_type IN ('workshop', 'seminar', 'retreat', 'special-event', 'teacher-training')),
  instructor_id UUID REFERENCES instructors(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  capacity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  early_bird_price DECIMAL(10, 2),
  early_bird_deadline DATE,
  requirements TEXT,
  what_to_bring TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create workshop registrations table
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_intent_id TEXT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workshop_id, user_id)
);

-- Indexes
CREATE INDEX idx_workshops_dates ON workshops(start_date, end_date);
CREATE INDEX idx_workshops_type ON workshops(workshop_type);
CREATE INDEX idx_workshop_registrations_workshop ON workshop_registrations(workshop_id);
CREATE INDEX idx_workshop_registrations_user ON workshop_registrations(user_id);

-- RLS policies
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Everyone can view active workshops
CREATE POLICY "Anyone can view active workshops"
  ON workshops FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage workshops
CREATE POLICY "Admins can manage workshops"
  ON workshops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
  ON workshop_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can register for workshops
CREATE POLICY "Users can register for workshops"
  ON workshop_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can cancel their own registrations
CREATE POLICY "Users can cancel their registrations"
  ON workshop_registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
  ON workshop_registrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'instructor')
    )
  );

-- Admins can manage all registrations
CREATE POLICY "Admins can manage registrations"
  ON workshop_registrations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
