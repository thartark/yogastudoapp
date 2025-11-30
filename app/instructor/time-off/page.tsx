import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function InstructorTimeOffPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from("time_off_requests")
    .select("*")
    .eq("instructor_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Off Requests</h1>
          <p className="text-muted-foreground">Request time off and view your requests</p>
        </div>
        <Button>Request Time Off</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests?.map((request) => (
              <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">
                    {new Date(request.start_date).toLocaleDateString()} -{" "}
                    {new Date(request.end_date).toLocaleDateString()}
                  </p>
                  {request.reason && <p className="text-sm text-muted-foreground">{request.reason}</p>}
                  {request.notes && <p className="text-xs text-muted-foreground">Admin notes: {request.notes}</p>}
                </div>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "default"
                      : request.status === "denied"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {request.status}
                </Badge>
              </div>
            ))}
            {(!requests || requests.length === 0) && (
              <p className="text-sm text-muted-foreground">No time off requests</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
