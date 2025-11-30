import type React from "react"
import { createClient, isMockMode } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (isMockMode) {
    // In mock mode, allow access to admin without authentication
    return (
      <div className="flex min-h-screen">
        <AdminNav />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    )
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
}
