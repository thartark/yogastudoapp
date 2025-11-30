-- Add series/course scheduling
CREATE TABLE IF NOT EXISTS class_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_sessions INTEGER NOT NULL,
  price DECIMAL(10, 2),
  max_participants INTEGER,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS series_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id UUID REFERENCES class_series(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  UNIQUE(series_id, user_id)
);

-- Add semi-private sessions
CREATE TABLE IF NOT EXISTS semi_private_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  min_participants INTEGER DEFAULT 2,
  max_participants INTEGER DEFAULT 5,
  price_per_person DECIMAL(10, 2),
  location_id UUID REFERENCES locations(id),
  room_id UUID REFERENCES rooms(id),
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semi_private_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES semi_private_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending',
  UNIQUE(session_id, user_id)
);

-- Add yoga style/tradition to classes
ALTER TABLE classes ADD COLUMN IF NOT EXISTS style TEXT; -- Vinyasa, Hatha, Yin, Restorative, etc.
ALTER TABLE classes ADD COLUMN IF NOT EXISTS equipment_required TEXT[]; -- ['mat', 'blocks', 'strap', 'bolster']
ALTER TABLE classes ADD COLUMN IF NOT EXISTS buffer_time_minutes INTEGER DEFAULT 0;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS season TEXT; -- 'spring', 'summer', 'fall', 'winter', 'year-round'

-- Add class type specializations
ALTER TABLE classes ADD COLUMN IF NOT EXISTS class_type TEXT DEFAULT 'regular'; -- 'regular', 'kids', 'prenatal', 'therapeutic', 'corporate', 'outdoor'
ALTER TABLE classes ADD COLUMN IF NOT EXISTS age_range TEXT; -- '3-6', '7-12', '13-17', 'adults', 'seniors', 'all'
ALTER TABLE classes ADD COLUMN IF NOT EXISTS special_requirements TEXT;

-- Add conflict detection
CREATE TABLE IF NOT EXISTS schedule_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_type TEXT NOT NULL, -- 'instructor_double_booked', 'room_double_booked', 'equipment_unavailable'
  instance_id_1 UUID REFERENCES class_instances(id),
  instance_id_2 UUID REFERENCES class_instances(id),
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false,
  resolution_notes TEXT
);

-- Add holiday schedules
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location_id UUID REFERENCES locations(id),
  classes_cancelled BOOLEAN DEFAULT true,
  special_schedule TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add retreat management
CREATE TABLE IF NOT EXISTS retreats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price DECIMAL(10, 2),
  max_participants INTEGER,
  instructor_ids UUID[],
  accommodation_included BOOLEAN DEFAULT false,
  meals_included BOOLEAN DEFAULT false,
  itinerary JSONB,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retreat_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retreat_id UUID REFERENCES retreats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  UNIQUE(retreat_id, user_id)
);

-- Add teacher training programs
CREATE TABLE IF NOT EXISTS teacher_training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  certification_level TEXT, -- '200hr', '300hr', '500hr'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_hours INTEGER,
  price DECIMAL(10, 2),
  max_students INTEGER,
  lead_instructor_id UUID REFERENCES profiles(id),
  curriculum JSONB,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teacher_training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES teacher_training_programs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending',
  completion_status TEXT DEFAULT 'in_progress',
  certification_date DATE,
  UNIQUE(program_id, student_id)
);

-- Add weather contingency for outdoor classes
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS weather_dependent BOOLEAN DEFAULT false;
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS backup_location_id UUID REFERENCES locations(id);
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS weather_status TEXT; -- 'scheduled', 'moved_indoors', 'cancelled'

-- Add virtual/hybrid support
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'in-person'; -- 'in-person', 'virtual', 'hybrid'
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS virtual_link TEXT;
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'America/New_York';
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS recording_available BOOLEAN DEFAULT false;
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS recording_url TEXT;

-- Enable RLS
ALTER TABLE class_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE semi_private_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE semi_private_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreats ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_training_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view class series" ON class_series FOR SELECT USING (true);
CREATE POLICY "Admins can manage class series" ON class_series FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Users can view their enrollments" ON series_enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can enroll in series" ON series_enrollments FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view semi-private sessions" ON semi_private_sessions FOR SELECT USING (true);
CREATE POLICY "Instructors and admins can manage sessions" ON semi_private_sessions FOR ALL USING (
  instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Users can view their bookings" ON semi_private_bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can book sessions" ON semi_private_bookings FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view conflicts" ON schedule_conflicts FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Anyone can view holidays" ON holidays FOR SELECT USING (true);
CREATE POLICY "Admins can manage holidays" ON holidays FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Anyone can view retreats" ON retreats FOR SELECT USING (true);
CREATE POLICY "Admins can manage retreats" ON retreats FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Users can view their registrations" ON retreat_registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can register for retreats" ON retreat_registrations FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view teacher training" ON teacher_training_programs FOR SELECT USING (true);
CREATE POLICY "Admins can manage teacher training" ON teacher_training_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Students can view their enrollments" ON teacher_training_enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can enroll" ON teacher_training_enrollments FOR INSERT WITH CHECK (student_id = auth.uid());
