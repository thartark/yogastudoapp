-- Add booking and client experience features

-- Favorite classes
CREATE TABLE IF NOT EXISTS favorite_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

-- Favorite instructors
CREATE TABLE IF NOT EXISTS favorite_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instructor_id)
);

-- Guest passes
CREATE TABLE IF NOT EXISTS guest_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  classes_remaining INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired'))
);

-- Spot reservations (mat placement)
CREATE TABLE IF NOT EXISTS spot_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  spot_number INTEGER NOT NULL,
  spot_location VARCHAR(50), -- 'front-left', 'center', 'back-right', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id)
);

-- Pre-class questionnaires
CREATE TABLE IF NOT EXISTS pre_class_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  injuries TEXT,
  focus_areas TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-class feedback
CREATE TABLE IF NOT EXISTS post_class_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  enjoyed_most TEXT,
  suggestions TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friend bookings
CREATE TABLE IF NOT EXISTS friend_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  friend_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_email VARCHAR(255),
  friend_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buddy system
CREATE TABLE IF NOT EXISTS buddy_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Class recordings
CREATE TABLE IF NOT EXISTS class_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_instance_id UUID REFERENCES class_instances(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration_minutes INTEGER,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  views_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress milestones
CREATE TABLE IF NOT EXISTS progress_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_type VARCHAR(50) NOT NULL, -- 'classes_attended', 'streak', 'style_mastery', etc.
  milestone_value INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  badge_name VARCHAR(100),
  badge_icon TEXT
);

-- Enable RLS
ALTER TABLE favorite_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_class_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_class_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own favorites" ON favorite_classes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their favorite instructors" ON favorite_instructors FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their guest passes" ON guest_passes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view spot reservations" ON spot_reservations FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can manage their questionnaires" ON pre_class_questionnaires FOR ALL USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can manage their feedback" ON post_class_feedback FOR ALL USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can view friend bookings" ON friend_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_id AND bookings.user_id = auth.uid())
);
CREATE POLICY "Users can manage their buddy pairs" ON buddy_pairs FOR ALL USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Everyone can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Everyone can view likes" ON community_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their likes" ON community_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view public recordings" ON class_recordings FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their milestones" ON progress_milestones FOR SELECT USING (auth.uid() = user_id);
