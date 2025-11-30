import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function TimeOffPage() {
  const supabase = await createServerClient()

  const { data: requests } = await supabase
    .from("time_off_requests")
    .select("*, instructor:profiles(full_name, email)")
    .order("created_at", { ascending: false })

  const pending = requests?.filter((r) => r.status === "pending") || []
  const approved = requests?.filter((r) => r.status === "approved") || []
  const denied = requests?.filter((r) => r.status === "denied") || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Off Requests</h1>
          <p className="text-muted-foreground">Manage staff time off and vacation requests</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approved.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denied.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests?.map((request) => (
              <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{request.instructor?.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.start_date).toLocaleDateString()} -{" "}
                    {new Date(request.end_date).toLocaleDateString()}
                  </p>
                  {request.reason && <p className="text-xs text-muted-foreground">{request.reason}</p>}
                </div>
                <div className="flex items-center gap-2">
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
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Deny
                      </Button>
                    </div>
                  )}
                </div>
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
