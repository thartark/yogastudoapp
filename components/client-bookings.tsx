"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function ClientBookings({ client }: { client: any }) {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]

      const { data } = await supabase
        .from("bookings")
        .select(
          `
          id,
          status,
          checked_in_at,
          class_instances!bookings_class_instance_id_fkey(
            id,
            scheduled_date,
            start_time,
            end_time,
            classes!class_instances_class_id_fkey(
              name,
              class_type
            )
          )
        `,
        )
        .eq("user_id", client.id)
        .eq("status", "confirmed")
        .gte("class_instances.scheduled_date", today)
        .order("class_instances(scheduled_date)")
        .order("class_instances(start_time)")
        .limit(10)

      setBookings(data || [])
      setIsLoading(false)
    }

    fetchBookings()
  }, [client.id])

  const handleCheckIn = async (bookingId: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "attended",
          checked_in_at: new Date().toISOString(),
        })
        .eq("id", bookingId)

      if (error) throw error

      // Refresh bookings
      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading bookings...</p>
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        <h3 className="font-semibold">{client.full_name}</h3>
        <p className="text-sm text-muted-foreground">{client.email}</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Upcoming Bookings:</p>
          {bookings.map((booking: any) => (
            <div key={booking.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-sm">{booking.class_instances?.classes?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(booking.class_instances?.scheduled_date).toLocaleDateString()} at{" "}
                  {booking.class_instances?.start_time}
                </p>
              </div>
              {booking.checked_in_at ? (
                <Badge variant="secondary">Checked In</Badge>
              ) : (
                <Button size="sm" onClick={() => handleCheckIn(booking.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Check In
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">No upcoming bookings</p>
      )}
    </div>
  )
}
