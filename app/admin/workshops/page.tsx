import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getMockData } from "@/lib/mock-data"

export default async function AdminWorkshopsPage() {
  const supabase = await createClient()

  let workshops: any[] = []

  if (!supabase) {
    // Use mock data
    const mockData = getMockData()
    workshops = mockData.workshops || []
  } else {
    const { data } = await supabase
      .from("workshops")
      .select(
        `
        id,
        name,
        workshop_type,
        start_date,
        end_date,
        capacity,
        price,
        is_active,
        workshop_registrations(id)
      `,
      )
      .order("start_date", { ascending: false })

    workshops = data || []
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workshops & Events</h1>
          <p className="text-muted-foreground">Manage workshops, retreats, and special events</p>
        </div>
        <Button asChild>
          <Link href="/admin/workshops/new">Create Workshop</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {workshops && workshops.length > 0 ? (
          workshops.map((workshop: any) => {
            const registrationCount = workshop.workshop_registrations?.length || 0
            const spotsLeft = workshop.capacity - registrationCount

            return (
              <Card key={workshop.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{workshop.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(workshop.start_date).toLocaleDateString()} -{" "}
                        {new Date(workshop.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {workshop.workshop_type?.replace("-", " ") || "workshop"}
                      </Badge>
                      <Badge variant={workshop.is_active !== false ? "default" : "secondary"}>
                        {workshop.is_active !== false ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Price:</span> ${workshop.price}
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span> {registrationCount}/{workshop.capacity}
                      </div>
                      <div>
                        <span className="font-medium">Available:</span> {spotsLeft} spots
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/workshops/${workshop.id}`}>Manage</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No workshops created yet</p>
              <Button asChild>
                <Link href="/admin/workshops/new">Create Your First Workshop</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
