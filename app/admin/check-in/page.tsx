import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckInSearch } from "@/components/check-in-search"
import { TodayClasses } from "@/components/today-classes"
import { getMockData } from "@/lib/mock-data"

export default async function CheckInPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  let todayInstances: any[] = []

  if (!supabase) {
    // Use mock data
    const mockData = getMockData()
    todayInstances = mockData.classInstances
      .filter((instance: any) => {
        const instanceDate = new Date(instance.scheduled_date).toISOString().split("T")[0]
        return instanceDate === today && instance.status === "scheduled"
      })
      .map((instance: any) => {
        const classInfo = mockData.classes.find((c: any) => c.id === instance.class_id)
        return {
          ...instance,
          classes: classInfo,
        }
      })
      .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))
  } else {
    const { data } = await supabase
      .from("class_instances")
      .select(
        `
        id,
        scheduled_date,
        start_time,
        end_time,
        room,
        status,
        classes!class_instances_class_id_fkey(
          name,
          class_type
        )
      `,
      )
      .eq("scheduled_date", today)
      .eq("status", "scheduled")
      .order("start_time")

    todayInstances = data || []
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Check-In</h1>
        <p className="text-muted-foreground">Manage class attendance and check-ins</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Search Client</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckInSearch />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {todayInstances && todayInstances.length > 0 ? (
              <div className="space-y-3">
                {todayInstances.map((instance: any) => (
                  <div key={instance.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{instance.classes?.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {instance.start_time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{instance.classes?.class_type}</p>
                    {instance.room && <p className="text-xs text-muted-foreground mt-1">Room: {instance.room}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No classes scheduled for today</p>
            )}
          </CardContent>
        </Card>
      </div>

      <TodayClasses />
    </div>
  )
}
