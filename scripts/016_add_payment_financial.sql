-- Payment Plans and Installments
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'membership', 'workshop', 'teacher_training', 'retreat'
  item_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  down_payment DECIMAL(10,2) DEFAULT 0,
  installments INTEGER NOT NULL,
  installment_amount DECIMAL(10,2) NOT NULL,
  frequency TEXT NOT NULL, -- 'weekly', 'biweekly', 'monthly'
  start_date DATE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'defaulted', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS installment_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_plan_id UUID REFERENCES payment_plans(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_intent_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'waived'
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store Credit
CREATE TABLE IF NOT EXISTS store_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  balance DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL, -- 'refund', 'gift', 'promotion', 'compensation'
  source_id UUID,
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_credit_id UUID REFERENCES store_credits(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT NOT NULL, -- 'credit', 'debit'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'rent', 'utilities', 'supplies', 'marketing', 'payroll', 'insurance', 'maintenance', 'other'
  subcategory TEXT,
  amount DECIMAL(10,2) NOT NULL,
  vendor TEXT,
  description TEXT,
  expense_date DATE NOT NULL,
  payment_method TEXT, -- 'cash', 'credit_card', 'bank_transfer', 'check'
  receipt_url TEXT,
  tax_deductible BOOLEAN DEFAULT false,
  location_id UUID REFERENCES locations(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructor Commissions and Payouts
CREATE TABLE IF NOT EXISTS instructor_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL, -- 'class', 'workshop', 'private_session', 'series'
  source_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2),
  commission_type TEXT, -- 'percentage', 'flat_rate', 'per_student'
  students_count INTEGER,
  class_date DATE,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'paid'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instructor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT, -- 'direct_deposit', 'check', 'paypal', 'venmo'
  payment_date DATE,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payout_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_id UUID REFERENCES instructor_payouts(id) ON DELETE CASCADE,
  commission_id UUID REFERENCES instructor_commissions(id),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tips
CREATE TABLE IF NOT EXISTS instructor_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  class_instance_id UUID REFERENCES class_instances(id),
  payment_intent_id TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Planning
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  category TEXT NOT NULL,
  allocated_amount DECIMAL(10,2) NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Charitable Donations
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  campaign TEXT,
  payment_intent_id TEXT,
  tax_receipt_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Gateway Fees
CREATE TABLE IF NOT EXISTS payment_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id TEXT NOT NULL,
  transaction_amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  gateway TEXT DEFAULT 'stripe',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE installment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own payment plans"
  ON payment_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own store credits"
  ON store_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view their commissions"
  ON instructor_commissions FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can view their payouts"
  ON instructor_payouts FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Users can view their tips"
  ON instructor_tips FOR SELECT
  USING (auth.uid() = instructor_id OR auth.uid() = client_id);

-- Admin policies
CREATE POLICY "Admins can manage all financial data"
  ON payment_plans FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

CREATE POLICY "Admins can manage expenses"
  ON expenses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

CREATE POLICY "Admins can manage budgets"
  ON budgets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));
