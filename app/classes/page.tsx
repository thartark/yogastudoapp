import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Users, TrendingUp, MapPin } from "lucide-react"
import { mockDataManager } from "@/lib/mock-data"

export default async function ClassesPage() {
  const supabase = await createClient()

  let classes
  let locations
  if (!supabase) {
    const mockClasses = mockDataManager.getClasses()
    locations = mockDataManager.getLocations()
    classes = mockClasses.map((c) => ({
      ...c,
      instructors: {
        profiles: {
          full_name:
            mockDataManager.getInstructors().find((i) => i.id === c.instructor_id)?.full_name || "Instructor TBA",
        },
      },
      location: locations.find((l) => l.id === c.location_id),
    }))
  } else {
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
        location_id,
        instructors!classes_instructor_id_fkey(
          profiles!instructors_user_id_fkey(full_name)
        ),
        locations(name, city, state)
      `,
      )
      .eq("is_active", true)
      .order("name")
    classes = data
  }

  const classesByLocation = classes?.reduce((acc: any, classItem: any) => {
    const locationName = classItem.location?.name || classItem.locations?.name || "All Locations"
    if (!acc[locationName]) {
      acc[locationName] = []
    }
    acc[locationName].push(classItem)
    return acc
  }, {})

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Prana Planner
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">My Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Our Classes</h1>
          <p className="mt-2 text-lg text-muted-foreground">Explore our diverse range of yoga classes for all levels</p>
        </div>

        {classesByLocation &&
          Object.entries(classesByLocation).map(([locationName, locationClasses]: [string, any]) => (
            <div key={locationName} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                {locationName}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {locationClasses.map((classItem: any) => (
                  <Card
                    key={classItem.id}
                    className="flex flex-col border-t-4"
                    style={{ borderTopColor: classItem.color_code || classItem.color || "#10b981" }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{classItem.name}</CardTitle>
                        <Badge variant="outline">{classItem.difficulty_level?.replace("_", " ")}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{classItem.class_type || classItem.style}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground mb-4 flex-1">{classItem.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{classItem.duration_minutes || classItem.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Max {classItem.capacity} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {classItem.instructors?.profiles?.full_name ||
                              classItem.instructor_name ||
                              "Instructor TBA"}
                          </span>
                        </div>
                      </div>

                      <Button asChild className="w-full">
                        <Link href={`/classes/${classItem.id}`}>View Schedule & Book</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

        {(!classesByLocation || Object.keys(classesByLocation).length === 0) && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No classes available at the moment</p>
          </div>
        )}
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Prana Planner. All rights reserved.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Built by Hayarta</p>
        </div>
      </footer>
    </div>
  )
}
