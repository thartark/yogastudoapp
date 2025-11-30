import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  if (!supabase) {
    return <>{children}</>
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (only admins can access analytics)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return <>{children}</>
}
