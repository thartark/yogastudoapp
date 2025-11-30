"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function FavoriteClassButton({
  classId,
  isFavorite: initialFavorite,
}: { classId: string; isFavorite: boolean }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleFavorite = async () => {
    setLoading(true)
    const supabase = createBrowserClient()

    if (isFavorite) {
      await supabase.from("favorite_classes").delete().eq("class_id", classId)
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("favorite_classes").insert({ user_id: user.id, class_id: classId })
      }
    }

    setIsFavorite(!isFavorite)
    setLoading(false)
    router.refresh()
  }

  return (
    <Button variant={isFavorite ? "default" : "outline"} size="sm" onClick={toggleFavorite} disabled={loading}>
      <Heart className={`h-4 w-4 mr-1 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  )
}
