import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UpdateRoleForm } from "@/components/update-role-form"
// Added mock data support
import { getMockData } from "@/lib/mock-data"

export default async function UserRolesPage() {
  const supabase = await createClient()

  // Handle mock mode when Supabase is not configured
  if (!supabase) {
    const mockData = getMockData()
    const mockUsers = mockData.clients.map((client) => ({
      id: client.id,
      email: client.email,
      full_name: client.name,
      role: "client" as const,
      created_at: new Date().toISOString(),
    }))

    // Add some mock admin and instructor users
    mockUsers.push({
      id: "admin-1",
      email: "admin@pranaplanner.com",
      full_name: "Admin User",
      role: "admin",
      created_at: new Date().toISOString(),
    })

    mockData.instructors.forEach((instructor) => {
      mockUsers.push({
        id: instructor.id,
        email: `${instructor.name.toLowerCase().replace(/\s+/g, ".")}@pranaplanner.com`,
        full_name: instructor.name,
        role: "instructor",
        created_at: new Date().toISOString(),
      })
    })

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user access levels and permissions (Demo Mode)</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Assign roles to control what users can access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex-1">
                    <p className="font-medium">{u.full_name || "No name"}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={u.role === "admin" ? "default" : u.role === "instructor" ? "secondary" : "outline"}>
                      {u.role}
                    </Badge>
                    <UpdateRoleForm userId={u.id} currentRole={u.role} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Admin</h3>
              <p className="text-sm text-muted-foreground">
                Full access to all features including finances, staff management, analytics, and system settings
              </p>
            </div>
            <div className="border-l-4 border-secondary pl-4">
              <h3 className="font-semibold">Instructor</h3>
              <p className="text-sm text-muted-foreground">
                Access to their schedule, availability management, time-off requests, and student information for their
                classes
              </p>
            </div>
            <div className="border-l-4 border-muted pl-4">
              <h3 className="font-semibold">Client</h3>
              <p className="text-sm text-muted-foreground">
                Access to book classes, manage memberships, view profile, and participate in community features
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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

  // Get all users
  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage user access levels and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Assign roles to control what users can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((u) => (
              <div key={u.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex-1">
                  <p className="font-medium">{u.full_name || "No name"}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={u.role === "admin" ? "default" : u.role === "instructor" ? "secondary" : "outline"}>
                    {u.role}
                  </Badge>
                  <UpdateRoleForm userId={u.id} currentRole={u.role} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold">Admin</h3>
            <p className="text-sm text-muted-foreground">
              Full access to all features including finances, staff management, analytics, and system settings
            </p>
          </div>
          <div className="border-l-4 border-secondary pl-4">
            <h3 className="font-semibold">Instructor</h3>
            <p className="text-sm text-muted-foreground">
              Access to their schedule, availability management, time-off requests, and student information for their
              classes
            </p>
          </div>
          <div className="border-l-4 border-muted pl-4">
            <h3 className="font-semibold">Client</h3>
            <p className="text-sm text-muted-foreground">
              Access to book classes, manage memberships, view profile, and participate in community features
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
