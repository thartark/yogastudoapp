import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users, Clock, TrendingUp } from "lucide-react"

export default async function InstructorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is instructor
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "instructor" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Get instructor record
  const { data: instructor } = await supabase.from("instructors").select("*").eq("user_id", user.id).single()

  if (!instructor) {
    redirect("/dashboard")
  }

  // Get upcoming classes for this instructor
  const { data: upcomingClasses } = await supabase
    .from("class_instances")
    .select(
      `
      id,
      scheduled_date,
      start_time,
      end_time,
      room,
      capacity,
      classes!class_instances_class_id_fkey(name, class_type)
    `,
    )
    .eq("instructor_id", instructor.id)
    .gte("scheduled_date", new Date().toISOString().split("T")[0])
    .order("scheduled_date")
    .order("start_time")
    .limit(10)

  // Get class stats
  const { count: totalClassesTaught } = await supabase
    .from("class_instances")
    .select("*", { count: "exact", head: true })
    .eq("instructor_id", instructor.id)
    .eq("status", "completed")

  const { count: upcomingCount } = await supabase
    .from("class_instances")
    .select("*", { count: "exact", head: true })
    .eq("instructor_id", instructor.id)
    .gte("scheduled_date", new Date().toISOString().split("T")[0])

  // Get total students (unique bookings)
  const { data: studentBookings } = await supabase
    .from("bookings")
    .select("user_id, class_instances!inner(instructor_id)")
    .eq("class_instances.instructor_id", instructor.id)
    .eq("status", "attended")

  const uniqueStudents = new Set(studentBookings?.map((b) => b.user_id)).size

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage your classes and students</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingCount || 0}</div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueStudents}</div>
              <p className="text-xs text-muted-foreground">Unique students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Classes Taught</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClassesTaught || 0}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Teaching hours</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/instructor/availability">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Availability
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/instructor/time-off">
                  <Clock className="mr-2 h-4 w-4" />
                  Request Time Off
                </Link>
              </Button>
              <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                <Link href="/profile">
                  <Users className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingClasses && upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.slice(0, 5).map((classInstance: any) => (
                    <div key={classInstance.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{classInstance.classes?.name}</h3>
                          <p className="text-sm text-muted-foreground">{classInstance.classes?.class_type}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {new Date(classInstance.scheduled_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>
                          {classInstance.start_time} - {classInstance.end_time}
                        </p>
                        {classInstance.room && <p>Room: {classInstance.room}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming classes scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
