# Prana Planner - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### ⚠️ IMPORTANT: How to Run SQL Scripts

**DO NOT** try to run SQL files from your terminal like `./script.sql` - that won't work!

SQL scripts must be run **inside the Supabase SQL Editor** in your browser. Here's how:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Click **SQL Editor** in the left sidebar (it has a database icon)
4. Click **New Query** button
5. **Open** the file `scripts/000_COMPLETE_SETUP.sql` in your code editor (VS Code, etc.)
6. **Copy ALL the contents** (Cmd+A or Ctrl+A, then Cmd+C or Ctrl+C)
7. **Paste** into the Supabase SQL editor window
8. Click the green **Run** button (or press Cmd/Ctrl + Enter)
9. Wait for it to complete (should take 10-30 seconds)
10. You should see "Success. No rows returned" - that's good!

### Step 1: Set Up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the ENTIRE contents of `scripts/000_COMPLETE_SETUP.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Wait for it to complete (should take 10-30 seconds)

### Step 2: Create Your Admin Account

1. Start your app locally: `npm run dev`
2. Go to `http://localhost:3000`
3. Click **Get Started** and sign up with your email
4. Go back to Supabase SQL Editor
5. Open `scripts/021_make_me_admin.sql`
6. Replace `'your-email@example.com'` with YOUR actual email
7. Run the query
8. Refresh your app - you should now see the Admin Dashboard link!

### Step 3: Explore All Features

Now you have access to everything:

**As Admin, you can:**
- ✅ Manage classes, schedules, and instructors
- ✅ View finances, expenses, and revenue
- ✅ Manage staff, payouts, and permissions
- ✅ Create workshops, products, and memberships
- ✅ View analytics and reports
- ✅ Manage user roles and permissions

**All 50+ Features Are Live:**
1. ✅ Unlimited class scheduling
2. ✅ Recurring class setup
3. ✅ Multi-location management
4. ✅ Waitlist management
5. ✅ Online booking
6. ✅ Membership plans (unlimited, class packs, punch cards)
7. ✅ Payment processing (Stripe)
8. ✅ Workshop & event management
9. ✅ Retail shop
10. ✅ Private sessions
11. ✅ Staff management & payroll
12. ✅ Financial reporting
13. ✅ Client profiles & medical info
14. ✅ Notifications & reminders
15. ✅ Gift cards & discount codes
16. ✅ Payment plans
17. ✅ Community features
18. ✅ Class recordings
19. ✅ Achievements & progress tracking
20. ✅ And 30+ more features!

### Step 4: Add Sample Data (Optional)

Want to see the app with realistic data? The setup script already includes:
- ✅ 6 sample classes (Morning Flow, Power Yoga, Gentle Hatha, etc.)
- ✅ 5 membership types (Drop-in, Class Packs, Unlimited)
- ✅ 6 retail products (Mats, Blocks, Straps, etc.)
- ✅ 2 studio rooms
- ✅ 1 location

To add more:
1. Go to Admin Dashboard → Classes → Create Class
2. Go to Admin Dashboard → Shop → Add Product
3. Go to Admin Dashboard → Workshops → Create Workshop

### Troubleshooting

**"I don't see the Admin Dashboard link"**
- Make sure you ran the `021_make_me_admin.sql` script with YOUR email
- Try logging out and back in
- Check the Supabase SQL Editor to verify your role: 
  \`\`\`sql
  SELECT email, role FROM profiles WHERE email = 'your-email@example.com';
  \`\`\`

**"I get Supabase errors"**
- Make sure you ran the complete setup script first
- Check that your `.env.local` has the correct Supabase credentials
- Verify your Supabase project is active

**"The app is empty"**
- The setup script includes basic seed data
- As an admin, you can add more classes, products, etc. through the UI
- Or run additional seed scripts from the `scripts/` folder

### Next Steps

1. **Customize Your Studio**
   - Update location info in Admin → Settings
   - Add your instructors (create accounts, then set role to 'instructor')
   - Create your class schedule

2. **Set Up Payments**
   - Add your Stripe keys to `.env.local`
   - Test membership purchases
   - Configure payment plans

3. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - Update environment variables in Vercel dashboard

## 🎉 You're All Set!

Your yoga studio management platform is ready to use with all 50+ features implemented and working!
