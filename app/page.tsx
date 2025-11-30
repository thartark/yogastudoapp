import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  Calendar,
  Users,
  Award,
  ShoppingBag,
  Video,
  MessageSquare,
  TrendingUp,
  Settings,
  DollarSign,
  Clock,
  Heart,
  Star,
  Gift,
  MapPin,
} from "lucide-react"

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-balance bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Prana Planner
        </h1>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl text-balance">
          Find Your Balance
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
          Complete yoga studio management platform. Book classes, manage memberships, track your wellness journey, and
          grow your practice.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">Start Your Journey</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/classes">Browse Classes</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Quick Access Features */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-2xl font-bold">Explore Features</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Classes & Scheduling</h4>
              <p className="text-sm text-muted-foreground mb-4">Browse classes, book sessions, manage waitlists</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/classes">View Classes →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Award className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Memberships</h4>
              <p className="text-sm text-muted-foreground mb-4">Unlimited plans, class packs, family memberships</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/memberships">View Plans →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Workshops & Events</h4>
              <p className="text-sm text-muted-foreground mb-4">Special events, retreats, teacher training</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/workshops">View Events →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Private Sessions</h4>
              <p className="text-sm text-muted-foreground mb-4">One-on-one and semi-private bookings</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/private-sessions">Book Now →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <ShoppingBag className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Retail Shop</h4>
              <p className="text-sm text-muted-foreground mb-4">Yoga mats, props, apparel, and accessories</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/shop">Shop Now →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageSquare className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Community</h4>
              <p className="text-sm text-muted-foreground mb-4">Connect with members, share experiences</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/community">Join Community →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Video className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Class Recordings</h4>
              <p className="text-sm text-muted-foreground mb-4">Access on-demand video library</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/recordings">Watch Now →</Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Star className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Achievements</h4>
              <p className="text-sm text-muted-foreground mb-4">Track progress, earn badges, view stats</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/achievements">View Progress →</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Member Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-2xl font-bold">Member Portal</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <Heart className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Your Dashboard</h4>
              <p className="text-sm text-muted-foreground mb-4">View bookings, memberships, and activity</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </Card>

            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Your Profile</h4>
              <p className="text-sm text-muted-foreground mb-4">Manage personal info, preferences, medical details</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </Card>

            <Card className="p-6">
              <Gift className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Guest Passes</h4>
              <p className="text-sm text-muted-foreground mb-4">Share free trial classes with friends</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/guest-pass">Get Guest Pass</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Staff & Admin Section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-2xl font-bold">Staff & Admin Tools</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <Settings className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Admin Dashboard</h4>
              <p className="text-sm text-muted-foreground mb-4">Complete studio management</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">Admin Panel</Link>
              </Button>
            </Card>

            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Staff Management</h4>
              <p className="text-sm text-muted-foreground mb-4">Instructors, schedules, time-off</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/staff">Manage Staff</Link>
              </Button>
            </Card>

            <Card className="p-6">
              <DollarSign className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Finances</h4>
              <p className="text-sm text-muted-foreground mb-4">Revenue, expenses, payouts, reports</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/finances">View Finances</Link>
              </Button>
            </Card>

            <Card className="p-6">
              <TrendingUp className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold mb-2">Analytics</h4>
              <p className="text-sm text-muted-foreground mb-4">Performance metrics and insights</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-12 text-center text-2xl font-bold">Why Choose Prana Planner?</h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-xl font-semibold">Smart Scheduling</h4>
              <p className="text-muted-foreground">Recurring classes, waitlists, auto-reminders, conflict detection</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-xl font-semibold">Flexible Memberships</h4>
              <p className="text-muted-foreground">Unlimited plans, class packs, family memberships, payment plans</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-xl font-semibold">Complete Financials</h4>
              <p className="text-muted-foreground">Revenue tracking, expense management, payroll, tax reports</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-xl font-semibold">Staff Tools</h4>
              <p className="text-muted-foreground">
                Availability tracking, time-off, certifications, performance reviews
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-xl font-semibold">Community Features</h4>
              <p className="text-muted-foreground">Social feed, achievements, buddy system, referral rewards</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h4 className="mb-2 text-xl font-semibold">Multi-Location</h4>
              <p className="text-muted-foreground">Manage multiple studios, rooms, and locations seamlessly</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
