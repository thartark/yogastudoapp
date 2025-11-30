import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is instructor or admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "instructor" && profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-lg font-semibold">Instructor Portal</h1>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/instructor/dashboard">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/instructor/availability">
              <Calendar className="mr-2 h-4 w-4" />
              Availability
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/instructor/time-off">
              <Clock className="mr-2 h-4 w-4" />
              Time Off Requests
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
}
