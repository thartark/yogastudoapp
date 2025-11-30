"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface UpdateRoleFormProps {
  userId: string
  currentRole: string
}

export function UpdateRoleForm({ userId, currentRole }: UpdateRoleFormProps) {
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleUpdate = async () => {
    if (role === currentRole) return

    setLoading(true)
    try {
      const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

      if (error) throw error

      toast.success("Role updated successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to update role")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="client">Client</SelectItem>
          <SelectItem value="instructor">Instructor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      {role !== currentRole && (
        <Button size="sm" onClick={handleUpdate} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  )
}
