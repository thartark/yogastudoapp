"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, Plus, Copy, Download } from "lucide-react"
import Link from "next/link"
import { getMockData } from "@/lib/mock-data"

export default function ScheduleCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const mockData = getMockData()

  const instances = mockData.classInstances.filter((instance) => {
    const instanceDate = new Date(instance.start_time)
    if (viewMode === "day") {
      return instanceDate.toDateString() === selectedDate.toDateString()
    } else if (viewMode === "week") {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      return instanceDate >= weekStart && instanceDate < weekEnd
    }
    return true
  })

  const conflicts = detectConflicts(instances)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Calendar</h1>
          <p className="text-muted-foreground">Manage your class schedule with visual calendar</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/schedule/templates">
              <Copy className="h-4 w-4 mr-2" />
              Templates
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/admin/classes/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Link>
          </Button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Scheduling Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Badge variant="destructive">Conflict</Badge>
                  <span>{conflict.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <Button variant={viewMode === "day" ? "default" : "outline"} onClick={() => setViewMode("day")} size="sm">
            Day
          </Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} onClick={() => setViewMode("week")} size="sm">
            Week
          </Button>
          <Button variant={viewMode === "month" ? "default" : "outline"} onClick={() => setViewMode("month")} size="sm">
            Month
          </Button>
        </div>
        <div className="flex-1" />
        <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
          Today
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {viewMode === "week" && (
              <div className="grid grid-cols-8 gap-2">
                <div className="font-semibold text-sm">Time</div>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="font-semibold text-sm text-center">
                    {day}
                  </div>
                ))}

                {Array.from({ length: 14 }, (_, hour) => hour + 6).map((hour) => (
                  <>
                    <div key={`hour-${hour}`} className="text-sm text-muted-foreground">
                      {hour}:00
                    </div>
                    {Array.from({ length: 7 }, (_, day) => {
                      const date = new Date(selectedDate)
                      date.setDate(date.getDate() - date.getDay() + day)
                      date.setHours(hour, 0, 0, 0)

                      const dayInstances = instances.filter((inst) => {
                        const instDate = new Date(inst.start_time)
                        return instDate.getDate() === date.getDate() && instDate.getHours() === hour
                      })

                      return (
                        <div key={`cell-${day}-${hour}`} className="border rounded p-1 min-h-[60px]">
                          {dayInstances.map((inst) => {
                            const classInfo = mockData.classes.find((c) => c.id === inst.class_id)
                            return (
                              <div
                                key={inst.id}
                                className="text-xs p-1 mb-1 rounded cursor-pointer hover:opacity-80"
                                style={{ backgroundColor: classInfo?.color + "40" }}
                              >
                                <div className="font-semibold truncate">{inst.class_name}</div>
                                <div className="text-muted-foreground truncate">{inst.instructor_name}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    {inst.booked_count}/{inst.capacity}
                                  </Badge>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
            )}

            {viewMode === "day" && (
              <div className="space-y-2">
                {instances
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((inst) => {
                    const classInfo = mockData.classes.find((c) => c.id === inst.class_id)
                    const startTime = new Date(inst.start_time)
                    const endTime = new Date(inst.end_time)
                    return (
                      <Card key={inst.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-1 h-16 rounded" style={{ backgroundColor: classInfo?.color }} />
                              <div>
                                <h3 className="font-semibold">{inst.class_name}</h3>
                                <p className="text-sm text-muted-foreground">{inst.instructor_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-sm">
                                    {startTime.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {endTime.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {inst.booked_count}/{inst.capacity} booked
                                </div>
                                <Badge variant={inst.booked_count >= inst.capacity ? "destructive" : "secondary"}>
                                  {inst.booked_count >= inst.capacity ? "Full" : "Available"}
                                </Badge>
                              </div>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function detectConflicts(instances: any[]) {
  const conflicts: { message: string }[] = []
  const instructorSchedules = new Map<string, any[]>()

  instances.forEach((inst) => {
    if (!instructorSchedules.has(inst.instructor_id)) {
      instructorSchedules.set(inst.instructor_id, [])
    }
    instructorSchedules.get(inst.instructor_id)!.push(inst)
  })

  instructorSchedules.forEach((schedule, instructorId) => {
    const sorted = schedule.sort((a, b) => a.start_time.localeCompare(b.start_time))
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i]
      const next = sorted[i + 1]
      if (new Date(current.end_time) > new Date(next.start_time)) {
        conflicts.push({
          message: `${current.instructor_name} has overlapping classes: ${current.class_name} and ${next.class_name}`,
        })
      }
    }
  })

  return conflicts
}
