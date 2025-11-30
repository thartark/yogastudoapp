import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, User, Calendar } from "lucide-react"
import Link from "next/link"

export default async function FavoritesPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // Fetch favorite classes
  const { data: favoriteClasses } = await supabase
    .from("favorite_classes")
    .select(`
      id,
      class_id,
      classes (
        id,
        name,
        description,
        duration_minutes,
        difficulty_level,
        color
      )
    `)
    .eq("user_id", user.id)

  // Fetch favorite instructors
  const { data: favoriteInstructors } = await supabase
    .from("favorite_instructors")
    .select(`
      id,
      instructor_id,
      profiles!favorite_instructors_instructor_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq("user_id", user.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">Classes and instructors you love</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Favorite Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Favorite Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteClasses && favoriteClasses.length > 0 ? (
              <div className="space-y-4">
                {favoriteClasses.map((fav: any) => (
                  <div
                    key={fav.id}
                    className="p-4 border rounded-lg hover:border-primary transition-colors"
                    style={{ borderTopColor: fav.classes.color, borderTopWidth: "3px" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{fav.classes.name}</h3>
                      <Badge variant="outline">{fav.classes.difficulty_level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{fav.classes.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {fav.classes.duration_minutes} min
                      </span>
                      <Button asChild size="sm">
                        <Link href={`/classes/${fav.classes.id}`}>View Schedule</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No favorite classes yet. Browse classes and click the heart icon to save your favorites!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Favorite Instructors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Favorite Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteInstructors && favoriteInstructors.length > 0 ? (
              <div className="space-y-4">
                {favoriteInstructors.map((fav: any) => (
                  <div key={fav.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                    <h3 className="font-semibold mb-1">{fav.profiles.full_name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{fav.profiles.email}</p>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/instructors/${fav.instructor_id}`}>View Profile</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No favorite instructors yet. Find instructors you love and save them here!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
