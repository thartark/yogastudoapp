-- Add waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_instance_id UUID NOT NULL REFERENCES class_instances(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notified_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'converted', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(class_instance_id, user_id)
);

-- Index for faster lookups
CREATE INDEX idx_waitlist_class_instance ON waitlist(class_instance_id);
CREATE INDEX idx_waitlist_user ON waitlist(user_id);
CREATE INDEX idx_waitlist_status ON waitlist(status);

-- RLS policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own waitlist entries"
  ON waitlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove themselves from waitlist"
  ON waitlist FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all waitlist entries"
  ON waitlist FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Admins can manage waitlist"
  ON waitlist FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
