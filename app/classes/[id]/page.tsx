import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookClassButton } from "@/components/book-class-button"
import { Clock, Users, Star } from "lucide-react"
import { mockDataManager } from "@/lib/mock-data"

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let classData: any
  let instances: any[] = []
  let user: any = null
  let userBookings: any[] = []
  let userWaitlist: any[] = []

  if (!supabase) {
    // Use mock data
    const mockClass = mockDataManager.getClass(id)
    if (!mockClass) {
      notFound()
    }

    const instructor = mockDataManager.getInstructor(mockClass.instructor_id)
    classData = {
      id: mockClass.id,
      name: mockClass.name,
      description: mockClass.description,
      duration_minutes: mockClass.duration,
      capacity: mockClass.capacity,
      difficulty_level: mockClass.difficulty_level,
      class_type: mockClass.style,
      color_code: mockClass.color,
      instructors: {
        profiles: {
          full_name: instructor?.full_name || "Instructor TBA",
          email: instructor?.email,
        },
        bio: instructor?.bio,
        specialties: instructor?.specialties || [],
      },
    }

    // Get upcoming instances for this class
    const allInstances = mockDataManager.getClassInstances({ classId: id })
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    instances = allInstances
      .filter((inst) => new Date(inst.date) >= today)
      .slice(0, 14)
      .map((inst) => {
        const startTime = new Date(inst.start_time)
        const endTime = new Date(inst.end_time)
        return {
          id: inst.id,
          scheduled_date: inst.date,
          start_time: startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
          end_time: endTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
          room: inst.room_name,
          capacity: inst.capacity,
          status: inst.status,
          bookings: Array(inst.booked_count).fill({}),
        }
      })

    user = mockDataManager.getCurrentUser()
    userBookings = mockDataManager.getBookings(user.id)
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    const { data } = await supabase
      .from("classes")
      .select(
        `
      id,
      name,
      description,
      duration_minutes,
      capacity,
      difficulty_level,
      class_type,
      color_code,
      instructors!classes_instructor_id_fkey(
        profiles!instructors_user_id_fkey(full_name, email),
        bio,
        specialties
      )
    `,
      )
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (!data) {
      notFound()
    }
    classData = data

    // Get upcoming instances
    const { data: instancesData } = await supabase
      .from("class_instances")
      .select(
        `
      id,
      scheduled_date,
      start_time,
      end_time,
      room,
      capacity,
      status,
      bookings(id)
    `,
      )
      .eq("class_id", id)
      .eq("status", "scheduled")
      .gte("scheduled_date", new Date().toISOString().split("T")[0])
      .order("scheduled_date")
      .order("start_time")
      .limit(14)

    instances = instancesData || []

    if (user) {
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("class_instance_id")
        .eq("user_id", user.id)
        .in("class_instance_id", instances?.map((i: any) => i.id) || [])
        .eq("status", "confirmed")

      userBookings = bookingsData || []

      const { data: waitlistData } = await supabase
        .from("waitlist")
        .select("class_instance_id, position")
        .eq("user_id", user.id)
        .in("class_instance_id", instances?.map((i: any) => i.id) || [])
        .eq("status", "waiting")

      userWaitlist = waitlistData || []
    }
  }

  // Get reviews for this class
  const reviews = !supabase ? mockDataManager.getReviews({ classId: id }) : []

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Prana Planner
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/classes">All Classes</Link>
            </Button>
            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold tracking-tight">{classData.name}</h1>
                <Badge variant="outline" className="text-base capitalize">
                  {classData.difficulty_level.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">{classData.class_type}</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Class</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{classData.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{classData.duration_minutes} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Class Size</p>
                      <p className="text-sm text-muted-foreground">Max {classData.capacity} students</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {instances && instances.length > 0 ? (
                  <div className="space-y-3">
                    {instances.map((instance: any) => {
                      const bookedCount = instance.bookings?.length || 0
                      const spotsLeft = instance.capacity - bookedCount
                      const isFull = spotsLeft <= 0
                      const isBooked = userBookings.some((b) => b.class_instance_id === instance.id)
                      const waitlistEntry = userWaitlist.find((w) => w.class_instance_id === instance.id)

                      return (
                        <div
                          key={instance.id}
                          className="flex items-center justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-3 min-w-[80px]">
                              <p className="text-xs font-medium text-muted-foreground uppercase">
                                {new Date(instance.scheduled_date).toLocaleDateString("en-US", { weekday: "short" })}
                              </p>
                              <p className="text-2xl font-bold">
                                {new Date(instance.scheduled_date).toLocaleDateString("en-US", { day: "numeric" })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(instance.scheduled_date).toLocaleDateString("en-US", { month: "short" })}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">
                                {instance.start_time} - {instance.end_time}
                              </p>
                              {instance.room && <p className="text-sm text-muted-foreground">{instance.room}</p>}
                              <p className="text-sm text-muted-foreground">
                                {isFull ? (
                                  <span className="text-destructive font-medium">Class Full</span>
                                ) : (
                                  <span>
                                    {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          {user ? (
                            isBooked ? (
                              <Badge variant="secondary">Booked</Badge>
                            ) : waitlistEntry ? (
                              <Badge variant="outline">Waitlist #{waitlistEntry.position}</Badge>
                            ) : (
                              <BookClassButton
                                instanceId={instance.id}
                                userId={user.id}
                                disabled={false}
                                isFull={isFull}
                              />
                            )
                          ) : (
                            <Button asChild variant="outline">
                              <Link href="/auth/login">Sign in to book</Link>
                            </Button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No upcoming classes scheduled</p>
                )}
              </CardContent>
            </Card>

            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{review.user_name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">
                  {classData.instructors?.profiles?.full_name || "Instructor TBA"}
                </h3>
                {classData.instructors?.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{classData.instructors.bio}</p>
                )}
                {classData.instructors?.specialties && classData.instructors.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {classData.instructors.specialties.map((specialty: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
