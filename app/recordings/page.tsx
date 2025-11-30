import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Eye } from "lucide-react"
import Link from "next/link"
import { getMockData } from "@/lib/mock-data"

export default async function RecordingsPage() {
  const supabase = await createClient()

  let recordings: any[] = []

  if (!supabase) {
    const mockData = getMockData()
    recordings = [
      {
        id: "rec-1",
        title: "Morning Vinyasa Flow",
        description: "Start your day with an energizing vinyasa flow sequence",
        duration_minutes: 45,
        views_count: 234,
        thumbnail_url: "/yoga-sunrise-flow.jpg",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        profiles: { full_name: mockData.instructors[0]?.full_name || "Sarah Johnson" },
      },
      {
        id: "rec-2",
        title: "Gentle Yin Yoga",
        description: "Relaxing yin yoga practice for deep stretching and restoration",
        duration_minutes: 60,
        views_count: 189,
        thumbnail_url: "/yin-yoga-evening.jpg",
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        profiles: { full_name: mockData.instructors[1]?.full_name || "Michael Chen" },
      },
      {
        id: "rec-3",
        title: "Power Yoga for Strength",
        description: "Build strength and endurance with this dynamic power yoga class",
        duration_minutes: 50,
        views_count: 312,
        thumbnail_url: "/power-yoga-class.png",
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        profiles: { full_name: mockData.instructors[2]?.full_name || "Emma Rodriguez" },
      },
    ]
  } else {
    const { data } = await supabase
      .from("class_recordings")
      .select(`
        id,
        title,
        description,
        duration_minutes,
        views_count,
        thumbnail_url,
        created_at,
        profiles (
          full_name
        )
      `)
      .eq("is_public", true)
      .order("created_at", { ascending: false })

    recordings = data || []
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Class Recordings</h1>
        <p className="text-muted-foreground">Practice anytime with our recorded classes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recordings && recordings.length > 0 ? (
          recordings.map((recording: any) => (
            <Card key={recording.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-muted">
                {recording.thumbnail_url ? (
                  <img
                    src={recording.thumbnail_url || "/placeholder.svg"}
                    alt={recording.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recording.duration_minutes} min
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{recording.title}</CardTitle>
                <p className="text-sm text-muted-foreground">with {recording.profiles?.full_name || "Instructor"}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recording.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {recording.views_count} views
                  </span>
                  <Button asChild size="sm">
                    <Link href={`/recordings/${recording.id}`}>
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No recordings available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
