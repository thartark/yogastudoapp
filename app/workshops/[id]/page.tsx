import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users, DollarSign, CheckCircle } from "lucide-react"
import { RegisterWorkshopButton } from "@/components/register-workshop-button"

export default async function WorkshopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: workshop } = await supabase
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
      requirements,
      what_to_bring,
      instructors!workshops_instructor_id_fkey(
        profiles!instructors_user_id_fkey(full_name, email),
        bio,
        specialties
      ),
      workshop_registrations(id, user_id)
    `,
    )
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!workshop) {
    notFound()
  }

  const registrationCount = workshop.workshop_registrations?.length || 0
  const spotsLeft = workshop.capacity - registrationCount
  const isFull = spotsLeft <= 0
  const isEarlyBird = workshop.early_bird_deadline && new Date(workshop.early_bird_deadline) > new Date()
  const displayPrice = isEarlyBird ? workshop.early_bird_price : workshop.price
  const isRegistered = user && workshop.workshop_registrations?.some((r: any) => r.user_id === user.id)

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Yoga Studio
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/workshops">All Workshops</Link>
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
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold tracking-tight">{workshop.name}</h1>
                <Badge variant="outline" className="capitalize text-base">
                  {workshop.workshop_type.replace("-", " ")}
                </Badge>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This {workshop.workshop_type.replace("-", " ")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{workshop.description}</p>
              </CardContent>
            </Card>

            {workshop.requirements && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{workshop.requirements}</p>
                </CardContent>
              </Card>
            )}

            {workshop.what_to_bring && (
              <Card>
                <CardHeader>
                  <CardTitle>What to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{workshop.what_to_bring}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(workshop.start_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(workshop.end_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {workshop.start_time} - {workshop.end_time}
                    </p>
                  </div>
                </div>

                {workshop.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{workshop.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm text-muted-foreground">
                      {isFull ? (
                        <span className="text-destructive font-medium">Fully Booked</span>
                      ) : (
                        <span>
                          {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} remaining
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Price</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">${displayPrice}</p>
                      {isEarlyBird && workshop.price !== workshop.early_bird_price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">${workshop.price}</span>
                          <Badge variant="default" className="text-xs">
                            Early Bird
                          </Badge>
                        </>
                      )}
                    </div>
                    {isEarlyBird && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Early bird pricing ends {new Date(workshop.early_bird_deadline!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  {user ? (
                    isRegistered ? (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">You're registered!</span>
                      </div>
                    ) : (
                      <RegisterWorkshopButton
                        workshopId={workshop.id}
                        userId={user.id}
                        price={displayPrice}
                        disabled={isFull}
                      />
                    )
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Sign in to register</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">
                  {workshop.instructors?.profiles?.full_name || "Instructor TBA"}
                </h3>
                {workshop.instructors?.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{workshop.instructors.bio}</p>
                )}
                {workshop.instructors?.specialties && workshop.instructors.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {workshop.instructors.specialties.map((specialty: string, idx: number) => (
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
