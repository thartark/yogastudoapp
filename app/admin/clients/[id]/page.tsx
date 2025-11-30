import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const { data: client } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  const { data: tags } = await supabase
    .from("client_tag_assignments")
    .select("*, client_tags(*)")
    .eq("client_id", params.id)

  const { data: notes } = await supabase
    .from("client_notes")
    .select("*, author:profiles!client_notes_author_id_fkey(full_name)")
    .eq("client_id", params.id)
    .order("created_at", { ascending: false })

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, class_instances(*, classes(name))")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: memberships } = await supabase
    .from("memberships")
    .select("*, membership_types(name)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{client?.full_name}</h1>
          <p className="text-muted-foreground">{client?.email}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/clients/${params.id}/edit`}>Edit Client</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags?.map((tag: any) => (
          <Badge key={tag.id} style={{ backgroundColor: tag.client_tags.color }}>
            {tag.client_tags.name}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{client?.phone || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-medium">
                    {client?.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Emergency Contact:</span>
                  <p className="font-medium">{client?.emergency_contact_name || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Emergency Phone:</span>
                  <p className="font-medium">{client?.emergency_contact_phone || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {client?.medical_conditions && (
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{client.medical_conditions}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Button asChild>
            <Link href={`/admin/clients/${params.id}/notes/new`}>Add Note</Link>
          </Button>

          {notes?.map((note: any) => (
            <Card key={note.id} className={note.is_alert ? "border-destructive" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>
                    {new Date(note.created_at).toLocaleDateString()} by {note.author?.full_name}
                  </CardDescription>
                  {note.is_alert && <Badge variant="destructive">Alert</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{note.note_text}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          {bookings?.map((booking: any) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle className="text-lg">{booking.class_instances?.classes?.name}</CardTitle>
                <CardDescription>{new Date(booking.class_instances?.start_time).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    booking.status === "confirmed" ? "default" : booking.status === "attended" ? "secondary" : "outline"
                  }
                >
                  {booking.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="memberships" className="space-y-4">
          {memberships?.map((membership: any) => (
            <Card key={membership.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{membership.membership_types?.name}</CardTitle>
                  <Badge variant={membership.status === "active" ? "default" : "secondary"}>{membership.status}</Badge>
                </div>
                <CardDescription>
                  {new Date(membership.start_date).toLocaleDateString()} -{" "}
                  {new Date(membership.end_date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membership.classes_remaining !== null && (
                  <p className="text-sm">Classes remaining: {membership.classes_remaining}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
