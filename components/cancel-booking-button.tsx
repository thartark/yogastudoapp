"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return

    setIsLoading(true)

    const supabase = createClient()

    try {
      // Get booking details
      const { data: booking } = await supabase
        .from("bookings")
        .select("membership_id, memberships(membership_types(type), classes_remaining)")
        .eq("id", bookingId)
        .single()

      // Update booking status
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", bookingId)

      if (updateError) throw updateError

      // Refund class if it's a class pack
      if (booking?.memberships?.membership_types?.type === "class-pack") {
        const { error: refundError } = await supabase
          .from("memberships")
          .update({
            classes_remaining: (booking.memberships.classes_remaining || 0) + 1,
          })
          .eq("id", booking.membership_id)

        if (refundError) throw refundError
      }

      alert("Booking cancelled successfully!")
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isLoading}>
      <X className="h-4 w-4" />
    </Button>
  )
}
