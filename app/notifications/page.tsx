import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Bell } from "lucide-react"
import { MarkNotificationReadButton } from "@/components/mark-notification-read-button"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50)

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Yoga Studio
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Notifications</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/notifications/preferences">Preferences</Link>
          </Button>
        </div>

        <div className="space-y-3">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <Card key={notification.id} className={notification.is_read ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${notification.is_read ? "bg-muted" : "bg-primary/10"}`}>
                      <Bell className={`h-5 w-5 ${notification.is_read ? "text-muted-foreground" : "text-primary"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.is_read && <Badge variant="default">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">{notification.message}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        {notification.link && (
                          <Button variant="link" size="sm" className="h-auto p-0" asChild>
                            <Link href={notification.link}>View Details</Link>
                          </Button>
                        )}
                        {!notification.is_read && <MarkNotificationReadButton notificationId={notification.id} />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
