-- =====================================================
-- MAKE YOURSELF AN ADMIN
-- =====================================================
-- Replace 'your-email@example.com' with YOUR actual email
-- Run this AFTER you've signed up for an account
-- =====================================================

UPDATE profiles 
SET role = 'admin', 
    full_name = 'Admin User'
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT id, email, full_name, role FROM profiles WHERE email = 'your-email@example.com';
