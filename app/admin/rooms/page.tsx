import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function RoomsPage() {
  const supabase = await createServerClient()

  const { data: rooms } = await supabase.from("studio_rooms").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Studio Rooms</h1>
          <p className="text-muted-foreground">Manage your studio spaces and rooms</p>
        </div>
        <Button asChild>
          <Link href="/admin/rooms/new">Add Room</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms?.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{room.name}</CardTitle>
                <Badge variant={room.is_available ? "default" : "secondary"}>
                  {room.is_available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <CardDescription>Capacity: {room.capacity} people</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium mb-1">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities?.map((amenity: string) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                {room.hourly_rate && <p className="text-sm text-muted-foreground">Rental: ${room.hourly_rate}/hour</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
