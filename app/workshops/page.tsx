import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react"
import { mockDataManager } from "@/lib/mock-data"

export default async function WorkshopsPage() {
  const supabase = await createClient()

  let workshops: any[] = []
  let user: any = null

  if (!supabase) {
    // Use mock data
    const mockWorkshops = mockDataManager.getWorkshops()
    workshops = mockWorkshops.map((w) => ({
      id: w.id,
      name: w.title,
      description: w.description,
      workshop_type: w.type,
      start_date: w.start_date,
      end_date: w.end_date,
      start_time: new Date(w.start_date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      end_time: new Date(w.end_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      location: "Downtown Studio",
      capacity: w.capacity,
      price: w.price,
      early_bird_price: w.early_bird_price,
      early_bird_deadline: null,
      instructors: {
        profiles: {
          full_name: w.instructor_name,
        },
      },
      workshop_registrations: Array(w.registered_count).fill({}),
      image_url: w.image_url,
    }))

    user = mockDataManager.getCurrentUser()
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    const { data } = await supabase
      .from("workshops")
      .select(
        `
      id,
      name,
      description,
      workshop_type,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      capacity,
      price,
      early_bird_price,
      early_bird_deadline,
      instructors!workshops_instructor_id_fkey(
        profiles!instructors_user_id_fkey(full_name)
      ),
      workshop_registrations(id)
    `,
      )
      .eq("is_active", true)
      .gte("start_date", new Date().toISOString().split("T")[0])
      .order("start_date")

    workshops = data || []
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Prana Planner
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/classes">Classes</Link>
            </Button>
            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Workshops & Events</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Join us for special workshops, retreats, and training sessions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workshops && workshops.length > 0 ? (
            workshops.map((workshop: any) => {
              const registrationCount = workshop.workshop_registrations?.length || 0
              const spotsLeft = workshop.capacity - registrationCount
              const isFull = spotsLeft <= 0
              const isEarlyBird = workshop.early_bird_deadline && new Date(workshop.early_bird_deadline) > new Date()
              const displayPrice = isEarlyBird ? workshop.early_bird_price : workshop.price

              return (
                <Card key={workshop.id} className="flex flex-col">
                  {workshop.image_url && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={workshop.image_url || "/placeholder.svg"}
                        alt={workshop.name}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {workshop.workshop_type.replace("-", " ")}
                      </Badge>
                      {isEarlyBird && <Badge variant="default">Early Bird</Badge>}
                    </div>
                    <CardTitle className="text-xl">{workshop.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{workshop.description}</p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(workshop.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {workshop.start_time} - {workshop.end_time}
                        </span>
                      </div>
                      {workshop.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{workshop.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {isFull ? (
                            <span className="text-destructive font-medium">Full</span>
                          ) : (
                            <span>
                              {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">${displayPrice}</span>
                        {isEarlyBird && workshop.price !== workshop.early_bird_price && (
                          <span className="text-xs text-muted-foreground line-through">${workshop.price}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button asChild className="w-full" disabled={isFull}>
                        <Link href={`/workshops/${workshop.id}`}>{isFull ? "Fully Booked" : "View Details"}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No upcoming workshops or events at this time</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Prana Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
