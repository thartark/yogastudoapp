"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function MarkNotificationReadButton({ notificationId }: { notificationId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkRead = async () => {
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleMarkRead} disabled={isLoading} className="h-auto p-0">
      <Check className="h-4 w-4 mr-1" />
      Mark as read
    </Button>
  )
}
