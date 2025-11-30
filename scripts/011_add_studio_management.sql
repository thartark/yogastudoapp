-- Room/Space Management
CREATE TABLE IF NOT EXISTS studio_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[],
  is_available BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Tracking
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- 'mat', 'block', 'strap', 'bolster', 'blanket', 'prop'
  quantity INTEGER NOT NULL DEFAULT 0,
  condition VARCHAR(50) DEFAULT 'good', -- 'excellent', 'good', 'fair', 'needs_replacement'
  purchase_date DATE,
  last_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Maintenance Log
CREATE TABLE IF NOT EXISTS equipment_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(100), -- 'cleaning', 'repair', 'replacement'
  performed_by UUID REFERENCES profiles(id),
  maintenance_date DATE NOT NULL,
  notes TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client Tags/Segmentation
CREATE TABLE IF NOT EXISTS client_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7), -- Hex color code
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_tag_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES client_tags(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, tag_id)
);

-- Virtual/Online Classes
CREATE TABLE IF NOT EXISTS virtual_class_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE CASCADE,
  platform VARCHAR(50), -- 'zoom', 'google_meet', 'custom'
  meeting_url TEXT,
  meeting_id VARCHAR(255),
  meeting_password VARCHAR(255),
  recording_enabled BOOLEAN DEFAULT false,
  recording_url TEXT,
  max_virtual_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_instance_id)
);

-- Staff Roles and Permissions
CREATE TABLE IF NOT EXISTS staff_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB, -- Store permissions as JSON
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES staff_roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Client Birthday Tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday_reward_sent BOOLEAN DEFAULT false;

-- Client Notes (Admin/Staff only)
CREATE TABLE IF NOT EXISTS client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  note_type VARCHAR(50), -- 'general', 'medical_alert', 'preference', 'incident'
  note_text TEXT NOT NULL,
  is_alert BOOLEAN DEFAULT false, -- Show as alert/warning
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Package Expiration Warnings
CREATE TABLE IF NOT EXISTS expiration_warnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id) ON DELETE CASCADE,
  warning_type VARCHAR(50), -- 'expiring_soon', 'low_credits', 'expired'
  warning_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  template_type VARCHAR(100) NOT NULL, -- 'booking_confirmation', 'reminder', 'welcome', 'cancellation'
  subject VARCHAR(500) NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables TEXT[], -- Available template variables like {{name}}, {{class_name}}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class Capacity and Overbooking Settings
ALTER TABLE classes ADD COLUMN IF NOT EXISTS allow_overbooking BOOLEAN DEFAULT false;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS overbooking_limit INTEGER DEFAULT 0;

-- Add room assignment to class instances
ALTER TABLE class_instances ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES studio_rooms(id);

-- Instructor detailed info
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_handle VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS teaching_philosophy TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS favorite_quote TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_client_notes_client ON client_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_alert ON client_notes(is_alert);
CREATE INDEX IF NOT EXISTS idx_virtual_class_settings_instance ON virtual_class_settings(class_instance_id);
CREATE INDEX IF NOT EXISTS idx_expiration_warnings_user ON expiration_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_class_instances_room ON class_instances(room_id);

-- RLS Policies
ALTER TABLE studio_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_class_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expiration_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Studio Rooms Policies
CREATE POLICY "Anyone can view available rooms"
  ON studio_rooms FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Admins can manage rooms"
  ON studio_rooms FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Equipment Policies
CREATE POLICY "Staff can view equipment"
  ON equipment FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'instructor')
  ));

CREATE POLICY "Admins can manage equipment"
  ON equipment FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Client Notes Policies
CREATE POLICY "Staff can view client notes"
  ON client_notes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'instructor')
  ));

CREATE POLICY "Staff can create client notes"
  ON client_notes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'instructor')
  ));

-- Virtual Class Settings Policies
CREATE POLICY "Users with bookings can view virtual class settings"
  ON virtual_class_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.class_instance_id = virtual_class_settings.class_instance_id 
      AND bookings.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'instructor')
    )
  );

-- Email Templates Policies
CREATE POLICY "Admins can manage email templates"
  ON email_templates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff')
  ));

-- Seed default rooms
INSERT INTO studio_rooms (name, capacity, amenities) VALUES
  ('Main Studio', 30, ARRAY['mirrors', 'sound_system', 'heating', 'props']),
  ('Small Studio', 15, ARRAY['mirrors', 'sound_system', 'props']),
  ('Private Room', 5, ARRAY['sound_system', 'props'])
ON CONFLICT DO NOTHING;

-- Seed default equipment
INSERT INTO equipment (name, category, quantity, condition) VALUES
  ('Yoga Mats', 'mat', 40, 'good'),
  ('Yoga Blocks', 'block', 50, 'good'),
  ('Yoga Straps', 'strap', 40, 'good'),
  ('Bolsters', 'bolster', 20, 'good'),
  ('Blankets', 'blanket', 30, 'good')
ON CONFLICT DO NOTHING;

-- Seed default client tags
INSERT INTO client_tags (name, color, description) VALUES
  ('VIP', '#FFD700', 'High-value clients'),
  ('New Member', '#4CAF50', 'Recently joined'),
  ('At Risk', '#F44336', 'May churn soon'),
  ('Pregnant', '#9C27B0', 'Prenatal modifications needed'),
  ('Injury Recovery', '#FF9800', 'Recovering from injury')
ON CONFLICT DO NOTHING;

-- Seed default staff roles
INSERT INTO staff_roles (name, description, permissions) VALUES
  ('Admin', 'Full system access', '{"all": true}'::jsonb),
  ('Front Desk', 'Check-in and basic operations', '{"check_in": true, "view_schedule": true}'::jsonb),
  ('Instructor', 'Teaching and class management', '{"teach_classes": true, "view_students": true}'::jsonb)
ON CONFLICT DO NOTHING;

-- Seed email templates
INSERT INTO email_templates (name, template_type, subject, body_html, body_text, variables) VALUES
  (
    'Booking Confirmation',
    'booking_confirmation',
    'Class Booking Confirmed - {{class_name}}',
    '<h1>Booking Confirmed!</h1><p>Hi {{name}},</p><p>Your booking for {{class_name}} on {{date}} at {{time}} has been confirmed.</p>',
    'Hi {{name}}, Your booking for {{class_name}} on {{date}} at {{time}} has been confirmed.',
    ARRAY['name', 'class_name', 'date', 'time', 'instructor']
  ),
  (
    'Class Reminder',
    'reminder',
    'Reminder: {{class_name}} Tomorrow',
    '<h1>Class Reminder</h1><p>Hi {{name}},</p><p>This is a reminder that you have {{class_name}} tomorrow at {{time}}.</p>',
    'Hi {{name}}, This is a reminder that you have {{class_name}} tomorrow at {{time}}.',
    ARRAY['name', 'class_name', 'date', 'time', 'instructor']
  )
ON CONFLICT DO NOTHING;
