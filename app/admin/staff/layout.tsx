import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Handle mock mode when Supabase is not configured
  if (!supabase) {
    return <>{children}</>
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (only admins can access staff management)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return <>{children}</>
}
