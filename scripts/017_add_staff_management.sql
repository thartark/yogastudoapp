CREATE TABLE IF NOT EXISTS instructor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location_id UUID REFERENCES locations(id),
  is_preferred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  approved_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shift_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  replacement_instructor_id UUID REFERENCES profiles(id),
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  certification_number TEXT,
  issue_date DATE,
  expiration_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending_renewal')),
  document_url TEXT,
  continuing_education_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('background_check', 'insurance', 'contract', 'w9', 'emergency_contact', 'other')),
  document_name TEXT NOT NULL,
  document_url TEXT,
  expiration_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  review_date DATE NOT NULL,
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  teaching_quality INTEGER CHECK (teaching_quality BETWEEN 1 AND 5),
  professionalism INTEGER CHECK (professionalism BETWEEN 1 AND 5),
  punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
  student_engagement INTEGER CHECK (student_engagement BETWEEN 1 AND 5),
  strengths TEXT,
  areas_for_improvement TEXT,
  goals TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  hours_worked DECIMAL(5,2),
  class_instance_id UUID REFERENCES class_instances(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instructor_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instructor_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  base_rate DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  bonus_rate DECIMAL(5,2),
  requirements TEXT,
  benefits TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bonus_type TEXT NOT NULL CHECK (bonus_type IN ('performance', 'referral', 'retention', 'milestone', 'holiday', 'other')),
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  date_awarded DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instructor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  years_experience INTEGER,
  certifications TEXT,
  teaching_styles TEXT,
  availability TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'accepted', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guest_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  bio TEXT,
  rate DECIMAL(10,2),
  specialties TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  completed_date DATE,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add instructor tier to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instructor_tier_id UUID REFERENCES instructor_tiers(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS teaching_style TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Enable RLS
ALTER TABLE instructor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_off_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Instructors can view own availability" ON instructor_availability FOR SELECT USING (instructor_id = auth.uid());
CREATE POLICY "Instructors can manage own availability" ON instructor_availability FOR ALL USING (instructor_id = auth.uid());
CREATE POLICY "Admin can view all availability" ON instructor_availability FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Instructors can manage own time off" ON time_off_requests FOR ALL USING (instructor_id = auth.uid());
CREATE POLICY "Admin can manage all time off" ON time_off_requests FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Staff can view shift swaps" ON shift_swaps FOR SELECT USING (original_instructor_id = auth.uid() OR replacement_instructor_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));
CREATE POLICY "Instructors can create shift swaps" ON shift_swaps FOR INSERT WITH CHECK (original_instructor_id = auth.uid());
CREATE POLICY "Admin can manage shift swaps" ON shift_swaps FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Instructors can view own certifications" ON certifications FOR SELECT USING (instructor_id = auth.uid());
CREATE POLICY "Instructors can manage own certifications" ON certifications FOR ALL USING (instructor_id = auth.uid());
CREATE POLICY "Admin can view all certifications" ON certifications FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Staff can view own documents" ON staff_documents FOR SELECT USING (staff_id = auth.uid());
CREATE POLICY "Admin can manage all documents" ON staff_documents FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Staff can view own reviews" ON performance_reviews FOR SELECT USING (staff_id = auth.uid());
CREATE POLICY "Admin can manage reviews" ON performance_reviews FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Staff can view own hours" ON staff_hours FOR SELECT USING (staff_id = auth.uid());
CREATE POLICY "Admin can manage hours" ON staff_hours FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Public can view instructor specialties" ON instructor_specialties FOR SELECT USING (true);
CREATE POLICY "Instructors can manage own specialties" ON instructor_specialties FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "Public can view instructor tiers" ON instructor_tiers FOR SELECT USING (true);
CREATE POLICY "Admin can manage tiers" ON instructor_tiers FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff can view own bonuses" ON staff_bonuses FOR SELECT USING (staff_id = auth.uid());
CREATE POLICY "Admin can manage bonuses" ON staff_bonuses FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Public can submit applications" ON instructor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage applications" ON instructor_applications FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

CREATE POLICY "Admin can manage guest instructors" ON guest_instructors FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));
CREATE POLICY "Public can view guest instructors" ON guest_instructors FOR SELECT USING (true);

CREATE POLICY "Staff can view own onboarding" ON staff_onboarding FOR SELECT USING (staff_id = auth.uid());
CREATE POLICY "Admin can manage onboarding" ON staff_onboarding FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')));

-- Seed some instructor tiers
INSERT INTO instructor_tiers (name, level, base_rate, commission_rate, bonus_rate, requirements, benefits) VALUES
('Trainee', 1, 25.00, 5.00, 0.00, 'RYT-200 certification, 0-1 years experience', 'Access to continuing education'),
('Junior Instructor', 2, 35.00, 10.00, 2.00, 'RYT-200, 1-3 years experience', 'Health insurance subsidy, CE credits'),
('Senior Instructor', 3, 50.00, 15.00, 5.00, 'RYT-500, 3-5 years experience', 'Full health insurance, retirement matching'),
('Lead Instructor', 4, 75.00, 20.00, 10.00, 'RYT-500, 5+ years, specialty certifications', 'Full benefits, paid time off, bonuses'),
('Master Instructor', 5, 100.00, 25.00, 15.00, 'E-RYT 500, 10+ years, multiple specialties', 'Premium benefits, profit sharing, leadership role');
