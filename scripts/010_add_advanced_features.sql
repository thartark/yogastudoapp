-- Class Ratings and Reviews
CREATE TABLE IF NOT EXISTS class_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- Instructor Payroll
CREATE TABLE IF NOT EXISTS instructor_payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  total_classes INTEGER DEFAULT 0,
  total_private_sessions INTEGER DEFAULT 0,
  base_pay DECIMAL(10, 2) DEFAULT 0,
  bonus_pay DECIMAL(10, 2) DEFAULT 0,
  total_pay DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'paid'
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Analytics
CREATE TABLE IF NOT EXISTS revenue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_date DATE NOT NULL,
  revenue_type VARCHAR(50) NOT NULL, -- 'membership', 'workshop', 'private_session', 'retail', 'drop_in'
  amount DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Retention Metrics
CREATE TABLE IF NOT EXISTS retention_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_active_members INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  churned_members INTEGER DEFAULT 0,
  retention_rate DECIMAL(5, 2),
  avg_classes_per_member DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date)
);

-- Marketing Campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'social', 'referral'
  target_audience VARCHAR(50)[], -- ['new_members', 'inactive', 'all', 'specific_class']
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'paused'
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family/Group Memberships
CREATE TABLE IF NOT EXISTS family_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  membership_name VARCHAR(255) NOT NULL,
  max_members INTEGER DEFAULT 4,
  discount_percentage DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_membership_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_membership_id UUID REFERENCES family_memberships(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  relationship VARCHAR(50), -- 'spouse', 'child', 'parent', 'sibling'
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_membership_id, member_id)
);

-- Trial Classes
CREATE TABLE IF NOT EXISTS trial_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trial_type VARCHAR(50) NOT NULL, -- 'free_class', 'discounted_week', 'intro_package'
  price DECIMAL(10, 2) DEFAULT 0,
  duration_days INTEGER,
  max_classes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trial_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_offer_id UUID REFERENCES trial_offers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  classes_used INTEGER DEFAULT 0,
  converted_to_member BOOLEAN DEFAULT false,
  UNIQUE(trial_offer_id, user_id)
);

-- Class Substitutions
CREATE TABLE IF NOT EXISTS class_substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
  original_instructor_id UUID REFERENCES profiles(id),
  substitute_instructor_id UUID REFERENCES profiles(id),
  reason TEXT,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Streaks
CREATE TABLE IF NOT EXISTS attendance_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_class_date DATE,
  total_classes_attended INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  badge_icon VARCHAR(255),
  requirement_type VARCHAR(50) NOT NULL, -- 'classes_attended', 'streak', 'referrals', 'reviews'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Instructor Certifications
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specializations TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2);

-- Add drop-in pricing to classes
ALTER TABLE classes ADD COLUMN IF NOT EXISTS drop_in_price DECIMAL(10, 2);
ALTER TABLE classes ADD COLUMN IF NOT EXISTS allow_drop_in BOOLEAN DEFAULT true;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_class_reviews_class ON class_reviews(class_id);
CREATE INDEX IF NOT EXISTS idx_class_reviews_user ON class_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_instructor_payroll_instructor ON instructor_payroll(instructor_id);
CREATE INDEX IF NOT EXISTS idx_revenue_records_date ON revenue_records(record_date);
CREATE INDEX IF NOT EXISTS idx_revenue_records_type ON revenue_records(revenue_type);
CREATE INDEX IF NOT EXISTS idx_retention_metrics_date ON retention_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_family_memberships_primary ON family_memberships(primary_member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_streaks_user ON attendance_streaks(user_id);

-- RLS Policies
ALTER TABLE class_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE retention_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_substitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Users can view all reviews"
  ON class_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their bookings"
  ON class_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Payroll Policies
CREATE POLICY "Instructors can view their own payroll"
  ON instructor_payroll FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all payroll"
  ON instructor_payroll FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Revenue Policies
CREATE POLICY "Admins can view revenue records"
  ON revenue_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Achievements Policies
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Seed achievements
INSERT INTO achievements (name, description, requirement_type, requirement_value) VALUES
  ('First Class', 'Attended your first class', 'classes_attended', 1),
  ('Dedicated Yogi', 'Attended 10 classes', 'classes_attended', 10),
  ('Century Club', 'Attended 100 classes', 'classes_attended', 100),
  ('Week Warrior', '7-day attendance streak', 'streak', 7),
  ('Month Master', '30-day attendance streak', 'streak', 30),
  ('Referral Champion', 'Referred 5 friends', 'referrals', 5),
  ('Review Writer', 'Left 10 reviews', 'reviews', 10)
ON CONFLICT DO NOTHING;

-- Seed trial offers
INSERT INTO trial_offers (name, description, trial_type, price, max_classes) VALUES
  ('Free First Class', 'Try your first class completely free', 'free_class', 0, 1),
  ('Intro Week Pass', 'One week of unlimited classes for $29', 'discounted_week', 29, 999),
  ('3-Class Intro Pack', 'Try 3 classes for $39', 'intro_package', 39, 3)
ON CONFLICT DO NOTHING;
