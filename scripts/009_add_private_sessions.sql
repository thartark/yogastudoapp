-- Private Sessions (One-on-One Bookings)
CREATE TABLE IF NOT EXISTS private_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  session_type VARCHAR(50) NOT NULL, -- 'private', 'semi-private', 'group'
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
  notes TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructor Availability
CREATE TABLE IF NOT EXISTS instructor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount Codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase_amount DECIMAL(10, 2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  applicable_to VARCHAR(50)[], -- ['memberships', 'workshops', 'private_sessions', 'retail']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount Code Usage
CREATE TABLE IF NOT EXISTS discount_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID REFERENCES discount_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_type VARCHAR(50) NOT NULL, -- 'membership', 'workshop', 'private_session', 'retail'
  order_id UUID NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop-in Pricing (Single Class Purchases)
CREATE TABLE IF NOT EXISTS drop_in_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift Cards
CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  initial_amount DECIMAL(10, 2) NOT NULL,
  current_balance DECIMAL(10, 2) NOT NULL,
  purchaser_id UUID REFERENCES profiles(id),
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'redeemed', 'expired'
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift Card Transactions
CREATE TABLE IF NOT EXISTS gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID REFERENCES gift_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'redemption'
  amount DECIMAL(10, 2) NOT NULL,
  order_type VARCHAR(50), -- 'membership', 'workshop', 'private_session', 'retail'
  order_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_email VARCHAR(255) NOT NULL,
  referred_user_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'rewarded'
  reward_type VARCHAR(50), -- 'free_class', 'discount', 'credit'
  reward_value DECIMAL(10, 2),
  reward_redeemed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Automated Reminders
CREATE TABLE IF NOT EXISTS automated_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_type VARCHAR(50) NOT NULL, -- 'class_24hr', 'class_1hr', 'membership_expiring', 'workshop_upcoming'
  trigger_hours_before INTEGER, -- Hours before event to send reminder
  is_active BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminder Logs
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_type VARCHAR(50) NOT NULL,
  related_id UUID, -- class_instance_id, workshop_id, etc.
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_method VARCHAR(20), -- 'email', 'sms', 'push'
  status VARCHAR(20) DEFAULT 'sent' -- 'sent', 'failed', 'bounced'
);

-- Late Cancellation Policies
CREATE TABLE IF NOT EXISTS cancellation_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  hours_before_class INTEGER NOT NULL, -- Minimum hours before class to cancel without penalty
  penalty_type VARCHAR(50) NOT NULL, -- 'lose_credit', 'fee', 'warning'
  penalty_amount DECIMAL(10, 2), -- Fee amount if penalty_type is 'fee'
  applies_to VARCHAR(50)[], -- ['unlimited', 'class_pack', 'drop_in']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add cancellation policy tracking to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_penalty_applied BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_penalty_amount DECIMAL(10, 2);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_private_sessions_instructor ON private_sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_private_sessions_client ON private_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_private_sessions_date ON private_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON referrals(referred_user_id);

-- RLS Policies
ALTER TABLE private_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_in_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_policies ENABLE ROW LEVEL SECURITY;

-- Private Sessions Policies
CREATE POLICY "Users can view their own private sessions"
  ON private_sessions FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = instructor_id);

CREATE POLICY "Instructors can view their sessions"
  ON private_sessions FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all private sessions"
  ON private_sessions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Instructor Availability Policies
CREATE POLICY "Anyone can view instructor availability"
  ON instructor_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Instructors can manage their availability"
  ON instructor_availability FOR ALL
  USING (auth.uid() = instructor_id);

-- Discount Codes Policies
CREATE POLICY "Anyone can view active discount codes"
  ON discount_codes FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage discount codes"
  ON discount_codes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Drop-in Purchases Policies
CREATE POLICY "Users can view their own drop-in purchases"
  ON drop_in_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create drop-in purchases"
  ON drop_in_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Gift Cards Policies
CREATE POLICY "Users can view gift cards they purchased or received"
  ON gift_cards FOR SELECT
  USING (auth.uid() = purchaser_id OR recipient_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage all gift cards"
  ON gift_cards FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Referrals Policies
CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

-- Seed default cancellation policy
INSERT INTO cancellation_policies (name, hours_before_class, penalty_type, applies_to)
VALUES ('Standard Cancellation Policy', 12, 'lose_credit', ARRAY['unlimited', 'class_pack'])
ON CONFLICT DO NOTHING;

-- Seed default automated reminders
INSERT INTO automated_reminders (reminder_type, trigger_hours_before, email_enabled)
VALUES 
  ('class_24hr', 24, true),
  ('class_1hr', 1, true),
  ('membership_expiring', 168, true), -- 7 days
  ('workshop_upcoming', 48, true)
ON CONFLICT DO NOTHING;
