-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking_confirmation', 'booking_reminder', 'booking_cancelled', 'waitlist_spot_available', 'membership_expiring', 'membership_expired', 'workshop_registration', 'order_confirmation', 'order_shipped', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  email_booking_confirmation BOOLEAN DEFAULT TRUE,
  email_booking_reminder BOOLEAN DEFAULT TRUE,
  email_booking_cancelled BOOLEAN DEFAULT TRUE,
  email_waitlist_notification BOOLEAN DEFAULT TRUE,
  email_membership_expiring BOOLEAN DEFAULT TRUE,
  email_workshop_updates BOOLEAN DEFAULT TRUE,
  email_order_updates BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT TRUE,
  sms_booking_reminder BOOLEAN DEFAULT FALSE,
  sms_class_cancelled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables TEXT[], -- Array of variable names like ['user_name', 'class_name', 'date']
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can view and update their preferences
CREATE POLICY "Users can manage their preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Admins can view email templates
CREATE POLICY "Admins can manage email templates"
  ON email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Seed default email templates
INSERT INTO email_templates (name, subject, body, variables) VALUES
('booking_confirmation', 'Class Booking Confirmed', 
'Hi {{user_name}},

Your booking for {{class_name}} on {{date}} at {{time}} has been confirmed!

Class Details:
- Instructor: {{instructor_name}}
- Location: {{location}}
- Duration: {{duration}} minutes

We look forward to seeing you on the mat!

Namaste,
{{studio_name}}', 
ARRAY['user_name', 'class_name', 'date', 'time', 'instructor_name', 'location', 'duration', 'studio_name']),

('booking_reminder', 'Class Reminder - Tomorrow', 
'Hi {{user_name}},

This is a friendly reminder that you have {{class_name}} tomorrow at {{time}}.

Don''t forget to bring:
- Your yoga mat
- Water bottle
- Comfortable clothing

See you soon!

Namaste,
{{studio_name}}', 
ARRAY['user_name', 'class_name', 'time', 'studio_name']),

('membership_expiring', 'Your Membership is Expiring Soon', 
'Hi {{user_name}},

Your {{membership_name}} membership will expire on {{expiry_date}}.

To continue enjoying unlimited classes, please renew your membership before it expires.

Renew now: {{renewal_link}}

Thank you for being part of our community!

Namaste,
{{studio_name}}', 
ARRAY['user_name', 'membership_name', 'expiry_date', 'renewal_link', 'studio_name']),

('waitlist_spot_available', 'Spot Available in Your Waitlisted Class!', 
'Hi {{user_name}},

Great news! A spot has opened up in {{class_name}} on {{date}} at {{time}}.

You''ve been automatically moved from the waitlist to a confirmed booking.

See you in class!

Namaste,
{{studio_name}}', 
ARRAY['user_name', 'class_name', 'date', 'time', 'studio_name']);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
