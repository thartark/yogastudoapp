"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function GenerateInstancesButton({ classId }: { classId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      // Fetch class and schedules
      const { data: classData } = await supabase.from("classes").select("*").eq("id", classId).single()

      const { data: schedules } = await supabase
        .from("class_schedules")
        .select("*")
        .eq("class_id", classId)
        .eq("is_active", true)

      if (!classData || !schedules || schedules.length === 0) {
        alert("No active schedules found for this class")
        return
      }

      // Generate instances for the next 30 days
      const instances = []
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(today.getDate() + 30)

      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay()

        const matchingSchedules = schedules.filter((s: any) => s.day_of_week === dayOfWeek)

        for (const schedule of matchingSchedules) {
          instances.push({
            class_id: classId,
            instructor_id: classData.instructor_id,
            scheduled_date: d.toISOString().split("T")[0],
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            room: schedule.room,
            capacity: classData.capacity,
            status: "scheduled",
          })
        }
      }

      if (instances.length > 0) {
        const { error } = await supabase.from("class_instances").insert(instances)

        if (error) throw error

        router.refresh()
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleGenerate} disabled={isLoading}>
      <Calendar className="mr-2 h-4 w-4" />
      {isLoading ? "Generating..." : "Generate Instances (30 days)"}
    </Button>
  )
}
