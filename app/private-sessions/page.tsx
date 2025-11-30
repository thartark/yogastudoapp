import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { mockDataManager } from "@/lib/mock-data"
import { Clock, Award } from "lucide-react"

export default async function PrivateSessionsPage() {
  const supabase = await createClient()

  let instructors: any[] = []

  if (!supabase) {
    // Use mock data
    const mockInstructors = mockDataManager.getInstructors()
    instructors = mockInstructors.map((inst) => ({
      id: inst.id,
      full_name: inst.full_name,
      email: inst.email,
      bio: inst.bio,
      specialties: inst.specialties,
      certifications: inst.certifications,
      hourly_rate: inst.hourly_rate,
      avatar_url: inst.avatar_url,
    }))
  } else {
    const { data } = await supabase.from("profiles").select("*").eq("role", "instructor").order("full_name")
    instructors = data || []
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
            <Button variant="ghost" asChild>
              <Link href="/workshops">Workshops</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Private Sessions</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Book one-on-one sessions with our expert instructors for personalized guidance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors?.map((instructor) => (
            <Card key={instructor.id} className="flex flex-col">
              {instructor.avatar_url && (
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={instructor.avatar_url || "/placeholder.svg"}
                    alt={instructor.full_name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{instructor.full_name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {instructor.bio || "Certified Yoga Instructor"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {instructor.certifications && instructor.certifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Certifications</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {instructor.certifications.map((cert: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {instructor.specialties && instructor.specialties.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {instructor.specialties.map((specialty: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Session Types
                    </p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>60 min session</span>
                        <span className="font-medium">${instructor.hourly_rate || 80}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>90 min session</span>
                        <span className="font-medium">${Math.round((instructor.hourly_rate || 80) * 1.4)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4" asChild>
                  <Link href={`/private-sessions/${instructor.id}/book`}>Book Session</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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
