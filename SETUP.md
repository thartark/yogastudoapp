# Prana Planner - Setup Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works great)
- A Stripe account (test mode)

### Step 1: Clone and Install

\`\`\`bash
npm install
\`\`\`

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (takes ~2 minutes)
3. Go to Project Settings > API
4. Copy your project URL and anon/public key

### Step 3: Configure Environment Variables

1. Copy the example env file:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

2. Edit `.env.local` and add your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
\`\`\`

3. Add your Stripe keys (get from [stripe.com/dashboard](https://dashboard.stripe.com)):
\`\`\`env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
\`\`\`

### Step 4: Set Up Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Run the SQL scripts in order:

**Run these scripts one at a time:**

1. `scripts/001_create_schema.sql` - Creates all tables and RLS policies
2. `scripts/002_create_profile_trigger.sql` - Auto-creates profiles for new users
3. `scripts/003_seed_data.sql` - Adds initial membership types
4. `scripts/019_comprehensive_seed_data.sql` - Adds sample classes, products, workshops

**After you create your account:**

5. Edit `scripts/020_make_user_admin.sql` and replace `'your-email@example.com'` with your email
6. Run `scripts/020_make_user_admin.sql` - Makes you an admin

### Step 5: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Create Your Account

1. Click "Start" or "Sign Up"
2. Create an account with your email
3. Check your email for the confirmation link
4. Click the confirmation link
5. Run the `020_make_user_admin.sql` script (with your email) to make yourself an admin
6. Refresh the page - you should now see "Admin" in the top navigation

### Step 7: Explore the Features

Now you can:
- Browse the sample classes, workshops, and products
- Access the Admin Dashboard to manage everything
- Create new classes, schedules, and more
- Test the booking flow
- Explore all the features we've built!

## Troubleshooting

### "Your project's URL and Key are required"
- Make sure your `.env.local` file exists and has the correct Supabase credentials
- Restart your dev server after adding environment variables

### "I don't see the Admin link"
- Make sure you ran the `020_make_user_admin.sql` script with your email
- Refresh the page after running the script
- Check the Supabase Table Editor to verify your role is 'admin'

### "No classes showing up"
- Make sure you ran all the seed data scripts
- Check the Supabase Table Editor to see if data exists
- Try running `019_comprehensive_seed_data.sql` again

### "Can't book classes"
- You need an active membership first
- Go to Memberships page and purchase a membership (use Stripe test card: 4242 4242 4242 4242)
- Then you can book classes

## Deployment

Ready to deploy? The easiest way is to use Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add your environment variables in the Vercel dashboard
5. Deploy!

Your Supabase database will work with the deployed app automatically.

## Need Help?

Check the README.md for more information about the features and architecture.
