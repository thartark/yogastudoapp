"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TodayClasses() {
  const [classStats, setClassStats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      const { data: instances } = await supabase
        .from("class_instances")
        .select(
          `
          id,
          start_time,
          capacity,
          classes!class_instances_class_id_fkey(name),
          bookings(id, status)
        `,
        )
        .eq("scheduled_date", today)
        .eq("status", "scheduled")
        .order("start_time")

      if (instances) {
        const stats = instances.map((instance: any) => {
          const totalBookings = instance.bookings?.length || 0
          const checkedIn = instance.bookings?.filter((b: any) => b.status === "attended").length || 0

          return {
            id: instance.id,
            name: instance.classes?.name,
            time: instance.start_time,
            capacity: instance.capacity,
            totalBookings,
            checkedIn,
          }
        })

        setClassStats(stats)
      }

      setIsLoading(false)
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {classStats.length > 0 ? (
          <div className="space-y-4">
            {classStats.map((stat) => (
              <div key={stat.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <h3 className="font-semibold">{stat.name}</h3>
                  <p className="text-sm text-muted-foreground">{stat.time}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {stat.checkedIn} / {stat.totalBookings}
                    </p>
                    <p className="text-xs text-muted-foreground">Checked In</p>
                  </div>
                  <Badge variant={stat.totalBookings >= stat.capacity ? "destructive" : "secondary"}>
                    {stat.totalBookings} / {stat.capacity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No classes today</p>
        )}
      </CardContent>
    </Card>
  )
}
