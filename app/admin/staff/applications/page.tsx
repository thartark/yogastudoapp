import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function ApplicationsPage() {
  const supabase = await createServerClient()

  const { data: applications } = await supabase
    .from("instructor_applications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instructor Applications</h1>
        <p className="text-muted-foreground">Review and manage instructor applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications?.map((app) => (
              <div key={app.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {app.first_name} {app.last_name}
                      </p>
                      <Badge
                        variant={
                          app.status === "accepted"
                            ? "default"
                            : app.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {app.email} | {app.phone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Experience:</span> {app.years_experience} years
                    </p>
                    {app.certifications && (
                      <p className="text-sm">
                        <span className="font-medium">Certifications:</span> {app.certifications}
                      </p>
                    )}
                    {app.teaching_styles && (
                      <p className="text-sm">
                        <span className="font-medium">Teaching Styles:</span> {app.teaching_styles}
                      </p>
                    )}
                    {app.cover_letter && <p className="text-sm text-muted-foreground mt-2">{app.cover_letter}</p>}
                  </div>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm">Interview</Button>
                      <Button size="sm" variant="outline">
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(!applications || applications.length === 0) && (
              <p className="text-sm text-muted-foreground">No applications yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
