import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getMockData } from "@/lib/mock-data"

export default async function LocationsPage() {
  const supabase = await createServerClient()

  let locations: any[] = []

  if (!supabase) {
    // Use mock data
    const mockData = getMockData()
    locations = mockData.locations || []
  } else {
    const { data } = await supabase.from("locations").select("*").order("name")
    locations = data || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-muted-foreground">Manage your studio locations</p>
        </div>
        <Button asChild>
          <Link href="/admin/locations/new">Add Location</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations?.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{location.name}</CardTitle>
                  <CardDescription>
                    {location.city}, {location.state}
                  </CardDescription>
                </div>
                <Badge variant={location.is_active !== false ? "default" : "secondary"}>
                  {location.is_active !== false ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{location.address}</p>
                {location.phone && <p>Phone: {location.phone}</p>}
                {location.email && <p>Email: {location.email}</p>}
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent" asChild>
                <Link href={`/admin/locations/${location.id}/edit`}>Edit Location</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
