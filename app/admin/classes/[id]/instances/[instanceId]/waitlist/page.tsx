import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PromoteFromWaitlistButton } from "@/components/promote-from-waitlist-button"

export default async function WaitlistManagementPage({
  params,
}: {
  params: Promise<{ id: string; instanceId: string }>
}) {
  const { id, instanceId } = await params
  const supabase = await createClient()

  const { data: instance } = await supabase
    .from("class_instances")
    .select(
      `
      id,
      scheduled_date,
      start_time,
      end_time,
      capacity,
      classes!class_instances_class_id_fkey(name),
      bookings(id)
    `,
    )
    .eq("id", instanceId)
    .single()

  if (!instance) {
    notFound()
  }

  const { data: waitlistEntries } = await supabase
    .from("waitlist")
    .select(
      `
      id,
      position,
      joined_at,
      status,
      profiles!waitlist_user_id_fkey(full_name, email)
    `,
    )
    .eq("class_instance_id", instanceId)
    .eq("status", "waiting")
    .order("position")

  const bookedCount = instance.bookings?.length || 0
  const spotsLeft = instance.capacity - bookedCount

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Waitlist Management</h1>
        <p className="text-muted-foreground">
          {instance.classes?.name} -{" "}
          {new Date(instance.scheduled_date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at {instance.start_time}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={spotsLeft > 0 ? "default" : "destructive"}>
          {bookedCount}/{instance.capacity} booked ({spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"})
        </Badge>
        <Button variant="outline" asChild>
          <Link href={`/admin/classes/${id}/instances`}>Back to Instances</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Waitlist ({waitlistEntries?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {waitlistEntries && waitlistEntries.length > 0 ? (
            <div className="space-y-3">
              {waitlistEntries.map((entry: any) => (
                <div key={entry.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg font-semibold">
                      #{entry.position}
                    </Badge>
                    <div>
                      <p className="font-medium">{entry.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{entry.profiles?.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(entry.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {spotsLeft > 0 && (
                    <PromoteFromWaitlistButton
                      waitlistId={entry.id}
                      instanceId={instanceId}
                      userId={entry.profiles?.id}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No one on the waitlist</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
