"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function PromoteFromWaitlistButton({
  waitlistId,
  instanceId,
  userId,
}: {
  waitlistId: string
  instanceId: string
  userId: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePromote = async () => {
    if (!confirm("Promote this person from the waitlist to a confirmed booking?")) return

    setIsLoading(true)

    const supabase = createClient()

    try {
      // Get user's active membership
      const { data: memberships } = await supabase
        .from("memberships")
        .select("id, classes_remaining, membership_types(type)")
        .eq("user_id", userId)
        .eq("status", "active")
        .gte("end_date", new Date().toISOString().split("T")[0])

      if (!memberships || memberships.length === 0) {
        alert("User doesn't have an active membership. Cannot promote from waitlist.")
        return
      }

      const availableMembership = memberships.find((m: any) => {
        if (m.membership_types?.type === "unlimited") return true
        return m.classes_remaining && m.classes_remaining > 0
      })

      if (!availableMembership) {
        alert("User doesn't have any classes remaining. Cannot promote from waitlist.")
        return
      }

      // Create booking
      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: userId,
        class_instance_id: instanceId,
        membership_id: availableMembership.id,
        status: "confirmed",
      })

      if (bookingError) throw bookingError

      // Decrement classes_remaining if not unlimited
      if (availableMembership.membership_types?.type === "class-pack") {
        const { error: updateError } = await supabase
          .from("memberships")
          .update({
            classes_remaining: (availableMembership.classes_remaining || 0) - 1,
          })
          .eq("id", availableMembership.id)

        if (updateError) throw updateError
      }

      // Update waitlist entry status
      const { error: waitlistError } = await supabase
        .from("waitlist")
        .update({ status: "converted", notified_at: new Date().toISOString() })
        .eq("id", waitlistId)

      if (waitlistError) throw waitlistError

      alert("Successfully promoted from waitlist!")
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePromote} disabled={isLoading} size="sm">
      {isLoading ? "Promoting..." : "Promote to Class"}
    </Button>
  )
}
