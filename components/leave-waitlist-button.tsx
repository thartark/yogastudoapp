"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function LeaveWaitlistButton({ waitlistId }: { waitlistId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave the waitlist?")) return

    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("waitlist").delete().eq("id", waitlistId)

      if (error) throw error

      alert("You've been removed from the waitlist.")
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLeave} disabled={isLoading} variant="ghost" size="sm">
      {isLoading ? "Leaving..." : "Leave Waitlist"}
    </Button>
  )
}
