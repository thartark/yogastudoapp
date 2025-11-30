import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { NotificationPreferencesForm } from "@/components/notification-preferences-form"

export default async function NotificationPreferencesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let { data: preferences } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .single()

  // Create default preferences if they don't exist
  if (!preferences) {
    const { data: newPreferences } = await supabase
      .from("notification_preferences")
      .insert({ user_id: user.id })
      .select()
      .single()

    preferences = newPreferences
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Yoga Studio
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/notifications">Back to Notifications</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Notification Preferences</h1>
          <p className="mt-2 text-lg text-muted-foreground">Manage how you receive notifications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email & SMS Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationPreferencesForm preferences={preferences} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
