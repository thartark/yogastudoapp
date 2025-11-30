import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, User } from "lucide-react"
import { CancelBookingButton } from "@/components/cancel-booking-button"
import { LeaveWaitlistButton } from "@/components/leave-waitlist-button"
import { getMockData } from "@/lib/mock-data"

export default async function DashboardPage() {
  const supabase = await createClient()

  if (!supabase) {
    const mockData = getMockData()

    return (
      <div className="min-h-screen">
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <Link href="/" className="text-xl font-semibold">
              Yoga Studio
            </Link>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/classes">Browse Classes</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/memberships">Memberships</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back, Yogi!</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage your classes and memberships (Demo Mode)</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">demo@pranaplanner.com</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Memberships</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/memberships">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">Unlimited Monthly</h3>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      <p>Unlimited classes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Classes</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/classes">Book More</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Demo mode - book classes to see them here</p>
                  <Button asChild>
                    <Link href="/classes">Browse Classes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  // Redirect instructors to their dashboard
  if (profile?.role === "instructor") {
    redirect("/instructor/dashboard")
  }

  // Redirect admins to admin dashboard
  if (profile?.role === "admin") {
    redirect("/admin")
  }

  // Continue with client dashboard for regular users
  const { data: fullProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get active memberships
  const { data: memberships } = await supabase
    .from("memberships")
    .select(
      `
      id,
      start_date,
      end_date,
      status,
      classes_remaining,
      membership_types(name, type)
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .gte("end_date", new Date().toISOString().split("T")[0])

  // Get upcoming bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      class_instances!bookings_class_instance_id_fkey(
        id,
        scheduled_date,
        start_time,
        end_time,
        room,
        classes!class_instances_class_id_fkey(
          name,
          class_type
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "confirmed")
    .gte("class_instances.scheduled_date", new Date().toISOString().split("T")[0])
    .order("class_instances(scheduled_date)")
    .limit(10)

  const { data: waitlistEntries } = await supabase
    .from("waitlist")
    .select(
      `
      id,
      position,
      joined_at,
      status,
      class_instances!waitlist_class_instance_id_fkey(
        id,
        scheduled_date,
        start_time,
        end_time,
        room,
        classes!class_instances_class_id_fkey(
          name,
          class_type
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .eq("status", "waiting")
    .gte("class_instances.scheduled_date", new Date().toISOString().split("T")[0])
    .order("class_instances(scheduled_date)")

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Yoga Studio
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/classes">Browse Classes</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/memberships">Memberships</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, {fullProfile?.full_name || "Yogi"}!</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage your classes and memberships</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberships?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">{fullProfile?.email}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Memberships</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/memberships">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {memberships && memberships.length > 0 ? (
                <div className="space-y-4">
                  {memberships.map((membership: any) => (
                    <div key={membership.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{membership.membership_types?.name}</h3>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Valid until: {new Date(membership.end_date).toLocaleDateString()}</p>
                        {membership.classes_remaining !== null && (
                          <p>Classes remaining: {membership.classes_remaining}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active memberships</p>
                  <Button asChild>
                    <Link href="/memberships">Purchase Membership</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Classes</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/classes">Book More</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{booking.class_instances?.classes?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {booking.class_instances?.classes?.class_type}
                          </p>
                        </div>
                        <CancelBookingButton bookingId={booking.id} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {new Date(booking.class_instances?.scheduled_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          {booking.class_instances?.start_time} - {booking.class_instances?.end_time}
                        </p>
                        {booking.class_instances?.room && <p>Room: {booking.class_instances.room}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No upcoming classes</p>
                  <Button asChild>
                    <Link href="/classes">Browse Classes</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {waitlistEntries && waitlistEntries.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Waitlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waitlistEntries.map((entry: any) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{entry.class_instances?.classes?.name}</h3>
                        <p className="text-sm text-muted-foreground">{entry.class_instances?.classes?.class_type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Position #{entry.position}</Badge>
                        <LeaveWaitlistButton waitlistId={entry.id} />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {new Date(entry.class_instances?.scheduled_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p>
                        {entry.class_instances?.start_time} - {entry.class_instances?.end_time}
                      </p>
                      {entry.class_instances?.room && <p>Room: {entry.class_instances.room}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
