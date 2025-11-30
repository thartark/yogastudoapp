import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function HolidaysPage() {
  const supabase = await createServerClient()

  let holidays: any[] = []

  if (!supabase) {
    // Mock data for holidays
    holidays = [
      {
        id: "holiday-1",
        name: "New Year's Day",
        date: "2025-01-01",
        classes_cancelled: true,
        locations: { name: "All Locations" },
      },
      {
        id: "holiday-2",
        name: "Memorial Day",
        date: "2025-05-26",
        classes_cancelled: false,
        special_schedule: "Limited classes: 9 AM and 5 PM only",
        locations: { name: "Downtown Studio" },
      },
      {
        id: "holiday-3",
        name: "Independence Day",
        date: "2025-07-04",
        classes_cancelled: true,
        locations: { name: "All Locations" },
      },
    ]
  } else {
    const { data } = await supabase
      .from("holidays")
      .select(`
        *,
        locations(name)
      `)
      .order("date", { ascending: true })

    holidays = data || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Holiday Schedule</h1>
          <p className="text-muted-foreground">Manage studio closures and special schedules</p>
        </div>
        <Button asChild>
          <Link href="/admin/holidays/new">Add Holiday</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {holidays?.map((holiday: any) => (
          <Card key={holiday.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{holiday.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(holiday.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={holiday.classes_cancelled ? "destructive" : "default"}>
                  {holiday.classes_cancelled ? "Closed" : "Special Schedule"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {holiday.locations && <p className="text-sm text-muted-foreground">Location: {holiday.locations.name}</p>}
              {holiday.special_schedule && <p className="text-sm mt-2">{holiday.special_schedule}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
