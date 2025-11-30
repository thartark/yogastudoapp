import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function InstructorAvailabilityPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: availability } = await supabase
    .from("instructor_availability")
    .select("*, location:locations(name)")
    .eq("instructor_id", user?.id)
    .order("day_of_week")

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Availability</h1>
          <p className="text-muted-foreground">Manage your weekly availability</p>
        </div>
        <Button>Add Availability</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {days.map((day, index) => {
              const dayAvailability = availability?.filter((a) => a.day_of_week === index) || []
              return (
                <div key={day} className="border-b pb-4 last:border-0">
                  <p className="font-medium mb-2">{day}</p>
                  {dayAvailability.length > 0 ? (
                    <div className="space-y-2">
                      {dayAvailability.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span>
                              {slot.start_time} - {slot.end_time}
                            </span>
                            {slot.location && <Badge variant="outline">{slot.location.name}</Badge>}
                            {slot.is_preferred && <Badge variant="secondary">Preferred</Badge>}
                          </div>
                          <Button size="sm" variant="ghost">
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not available</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
