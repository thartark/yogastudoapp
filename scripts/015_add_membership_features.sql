-- Add comprehensive membership features

-- Add new columns to membership_types for advanced features
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS tier_level VARCHAR(20) CHECK (tier_level IN ('basic', 'bronze', 'silver', 'gold', 'platinum'));
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'annual', 'rolling', 'one-time'));
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS auto_renew_default BOOLEAN DEFAULT false;
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS peak_hours_only BOOLEAN DEFAULT false;
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS multi_studio_access BOOLEAN DEFAULT false;
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS trial_period_days INTEGER DEFAULT 0;
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS contract_length_months INTEGER;
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS family_plan BOOLEAN DEFAULT false;
ALTER TABLE membership_types ADD COLUMN IF NOT EXISTS max_family_members INTEGER;

-- Add new columns to memberships for tracking
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT false;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMPTZ;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS frozen_until TIMESTAMPTZ;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS freeze_reason TEXT;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS prorated_amount_cents INTEGER;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS contract_signed_at TIMESTAMPTZ;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS contract_end_date DATE;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS transferred_from_user_id UUID REFERENCES profiles(id);
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS transferred_at TIMESTAMPTZ;
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS discount_code_id UUID;

-- Create membership discount codes table
CREATE TABLE IF NOT EXISTS membership_discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value INTEGER NOT NULL, -- percentage (0-100) or cents
  applicable_to VARCHAR(50)[], -- ['student', 'senior', 'military', 'corporate', 'all']
  membership_type_ids UUID[], -- specific membership types or null for all
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create membership freeze history table
CREATE TABLE IF NOT EXISTS membership_freeze_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  frozen_at TIMESTAMPTZ NOT NULL,
  unfrozen_at TIMESTAMPTZ,
  freeze_reason TEXT,
  frozen_by_user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create membership upgrade/downgrade history
CREATE TABLE IF NOT EXISTS membership_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  from_membership_type_id UUID REFERENCES membership_types(id),
  to_membership_type_id UUID REFERENCES membership_types(id),
  change_type VARCHAR(20) CHECK (change_type IN ('upgrade', 'downgrade', 'transfer')),
  prorated_amount_cents INTEGER,
  effective_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create corporate membership programs table
CREATE TABLE IF NOT EXISTS corporate_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  membership_type_ids UUID[],
  employee_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  contract_start_date DATE,
  contract_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create corporate membership enrollments
CREATE TABLE IF NOT EXISTS corporate_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_program_id UUID REFERENCES corporate_programs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,
  employee_id VARCHAR(100),
  verified BOOLEAN DEFAULT false,
  enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create punch card table (alternative to class packs)
CREATE TABLE IF NOT EXISTS punch_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_punches INTEGER NOT NULL,
  remaining_punches INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  purchase_date DATE NOT NULL,
  expiration_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create punch card usage history
CREATE TABLE IF NOT EXISTS punch_card_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  punch_card_id UUID REFERENCES punch_cards(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE membership_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_freeze_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE punch_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE punch_card_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active discount codes"
  ON membership_discount_codes FOR SELECT
  USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Admins can manage discount codes"
  ON membership_discount_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Users can view own freeze history"
  ON membership_freeze_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.id = membership_freeze_history.membership_id AND memberships.user_id = auth.uid()));

CREATE POLICY "Admins can view all freeze history"
  ON membership_freeze_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Users can view own membership changes"
  ON membership_changes FOR SELECT
  USING (EXISTS (SELECT 1 FROM memberships WHERE memberships.id = membership_changes.membership_id AND memberships.user_id = auth.uid()));

CREATE POLICY "Admins can manage membership changes"
  ON membership_changes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Anyone can view active corporate programs"
  ON corporate_programs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage corporate programs"
  ON corporate_programs FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Users can view own corporate enrollments"
  ON corporate_enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own corporate enrollments"
  ON corporate_enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own punch cards"
  ON punch_cards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage punch cards"
  ON punch_cards FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_membership_discount_codes_code ON membership_discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_membership_freeze_history_membership ON membership_freeze_history(membership_id);
CREATE INDEX IF NOT EXISTS idx_membership_changes_membership ON membership_changes(membership_id);
CREATE INDEX IF NOT EXISTS idx_corporate_enrollments_user ON corporate_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_punch_cards_user ON punch_cards(user_id);
