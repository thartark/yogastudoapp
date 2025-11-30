"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function BookClassButton({
  instanceId,
  userId,
  disabled,
  isFull,
}: {
  instanceId: string
  userId: string
  disabled?: boolean
  isFull?: boolean
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleBook = async () => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { data: memberships } = await supabase
        .from("memberships")
        .select("id, classes_remaining, membership_types(type)")
        .eq("user_id", userId)
        .eq("status", "active")
        .gte("end_date", new Date().toISOString().split("T")[0])

      if (!memberships || memberships.length === 0) {
        alert("You need an active membership to book classes. Please purchase a membership first.")
        router.push("/memberships")
        return
      }

      const availableMembership = memberships.find((m: any) => {
        if (m.membership_types?.type === "unlimited") return true
        return m.classes_remaining && m.classes_remaining > 0
      })

      if (!availableMembership) {
        alert("You don't have any classes remaining. Please purchase a new membership or class pack.")
        router.push("/memberships")
        return
      }

      if (isFull) {
        // Get current waitlist position
        const { data: waitlistData } = await supabase
          .from("waitlist")
          .select("position")
          .eq("class_instance_id", instanceId)
          .order("position", { ascending: false })
          .limit(1)

        const nextPosition = waitlistData && waitlistData.length > 0 ? waitlistData[0].position + 1 : 1

        const { error: waitlistError } = await supabase.from("waitlist").insert({
          user_id: userId,
          class_instance_id: instanceId,
          position: nextPosition,
          status: "waiting",
        })

        if (waitlistError) {
          if (waitlistError.code === "23505") {
            alert("You're already on the waitlist for this class!")
          } else {
            throw waitlistError
          }
        } else {
          alert(`You've been added to the waitlist at position ${nextPosition}. We'll notify you if a spot opens up!`)
          router.refresh()
        }
        return
      }

      const { error: bookingError } = await supabase.from("bookings").insert({
        user_id: userId,
        class_instance_id: instanceId,
        membership_id: availableMembership.id,
        status: "confirmed",
      })

      if (bookingError) throw bookingError

      if (availableMembership.membership_types?.type === "class-pack") {
        const { error: updateError } = await supabase
          .from("memberships")
          .update({
            classes_remaining: (availableMembership.classes_remaining || 0) - 1,
          })
          .eq("id", availableMembership.id)

        if (updateError) throw updateError
      }

      alert("Class booked successfully!")
      router.refresh()
    } catch (err: any) {
      if (err.code === "23505") {
        alert("You've already booked this class!")
      } else {
        alert(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleBook} disabled={disabled || isLoading} variant={isFull ? "outline" : "default"}>
      {isLoading ? "Processing..." : isFull ? "Join Waitlist" : "Book Class"}
    </Button>
  )
}
