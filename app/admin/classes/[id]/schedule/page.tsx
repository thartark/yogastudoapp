import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default async function ClassSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: classData } = await supabase.from("classes").select("*").eq("id", id).single()

  if (!classData) {
    notFound()
  }

  const { data: schedules } = await supabase
    .from("class_schedules")
    .select("*")
    .eq("class_id", id)
    .order("day_of_week")
    .order("start_time")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{classData.name} - Schedule</h1>
        <p className="text-muted-foreground">Manage recurring class schedules</p>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/admin/classes/${id}/schedule/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/classes">Back to Classes</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules && schedules.length > 0 ? (
          schedules.map((schedule: any) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{DAYS[schedule.day_of_week]}</CardTitle>
                  <Badge variant={schedule.is_active ? "default" : "secondary"}>
                    {schedule.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Start Time:</span> {schedule.start_time}
                  </div>
                  <div>
                    <span className="font-medium">End Time:</span> {schedule.end_time}
                  </div>
                  {schedule.room && (
                    <div>
                      <span className="font-medium">Room:</span> {schedule.room}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No schedules found</p>
              <Button asChild>
                <Link href={`/admin/classes/${id}/schedule/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
