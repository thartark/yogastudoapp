import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function SeriesPage() {
  const supabase = await createServerClient()

  let series: any[] = []

  if (!supabase) {
    // Mock data for series
    series = [
      {
        id: "series-1",
        name: "Foundation Series",
        start_date: "2025-02-01",
        end_date: "2025-03-15",
        total_sessions: 6,
        price: 180,
        max_participants: 15,
        classes: { name: "Beginner Flow" },
        locations: { name: "Downtown Studio" },
      },
      {
        id: "series-2",
        name: "Advanced Inversions",
        start_date: "2025-03-01",
        end_date: "2025-04-12",
        total_sessions: 8,
        price: 280,
        max_participants: 10,
        classes: { name: "Advanced Vinyasa" },
        locations: { name: "Uptown Studio" },
      },
    ]
  } else {
    const { data } = await supabase
      .from("class_series")
      .select(`
        *,
        classes(name),
        locations(name)
      `)
      .order("start_date", { ascending: true })

    series = data || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Series & Courses</h1>
          <p className="text-muted-foreground">Manage multi-week courses and series</p>
        </div>
        <Button asChild>
          <Link href="/admin/series/new">Create Series</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {series?.map((item: any) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.classes?.name}</CardDescription>
                </div>
                <Badge>{item.total_sessions} sessions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(item.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{new Date(item.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">${item.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium">{item.max_participants} students</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/series/${item.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
