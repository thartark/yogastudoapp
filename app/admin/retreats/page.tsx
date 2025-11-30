import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getMockData } from "@/lib/mock-data"

export default async function RetreatsPage() {
  const supabase = await createServerClient()

  let retreats: any[] = []

  if (!supabase) {
    // Use mock data
    const mockData = getMockData()
    retreats = mockData.workshops?.filter((w: any) => w.workshop_type === "retreat") || []
  } else {
    const { data } = await supabase.from("retreats").select("*").order("start_date", { ascending: true })
    retreats = data || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Retreats</h1>
          <p className="text-muted-foreground">Manage yoga retreats and immersive experiences</p>
        </div>
        <Button asChild>
          <Link href="/admin/retreats/new">Create Retreat</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {retreats?.map((retreat: any) => (
          <Card key={retreat.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{retreat.name}</CardTitle>
                  <CardDescription>{retreat.location || "TBD"}</CardDescription>
                </div>
                <Badge variant={retreat.status === "upcoming" ? "default" : "secondary"}>
                  {retreat.status || "upcoming"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{retreat.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Dates</p>
                  <p className="font-medium">
                    {new Date(retreat.start_date).toLocaleDateString()} -{" "}
                    {new Date(retreat.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">${retreat.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium">{retreat.capacity || retreat.max_participants} guests</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Includes</p>
                  <p className="font-medium">Lodging & Meals</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/retreats/${retreat.id}`}>Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
