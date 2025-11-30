-- Add color coding, difficulty levels, and multi-location support to classes

-- Add difficulty level and color to classes table
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
ADD COLUMN IF NOT EXISTS color_code TEXT DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES rooms(id);

-- Add locations table for multi-location support
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add location reference to rooms
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id);

-- Add location reference to class_instances
ALTER TABLE class_instances
ADD COLUMN IF NOT EXISTS location_id UUID REFERENCES locations(id);

-- Update classes table to support automatic room assignment
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS preferred_room_id UUID REFERENCES rooms(id),
ADD COLUMN IF NOT EXISTS auto_assign_room BOOLEAN DEFAULT false;

-- Create index for faster location queries
CREATE INDEX IF NOT EXISTS idx_rooms_location ON rooms(location_id);
CREATE INDEX IF NOT EXISTS idx_class_instances_location ON class_instances(location_id);

-- Insert default location
INSERT INTO locations (name, address, city, state, is_active)
VALUES ('Main Studio', '123 Yoga Street', 'San Francisco', 'CA', true)
ON CONFLICT DO NOTHING;

-- Add RLS policies for locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active locations" ON locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage locations" ON locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );
