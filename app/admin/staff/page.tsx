import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Calendar, Award, TrendingUp } from "lucide-react"
// Added mock data support
import { getMockData } from "@/lib/mock-data"

export default async function StaffManagementPage() {
  const supabase = await createClient()

  // Handle mock mode when Supabase is not configured
  if (!supabase) {
    const mockData = getMockData()
    const staff = mockData.instructors.map((instructor) => ({
      id: instructor.id,
      full_name: instructor.full_name || instructor.name || "Unknown",
      email: `${(instructor.full_name || instructor.name || "unknown").toLowerCase().replace(/\s+/g, ".")}@pranaplanner.com`,
      role: "instructor",
      teaching_style: instructor.specialties?.[0] || "General",
      instructor_tier: { name: "Senior", level: 2 },
    }))

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">Manage instructors, schedules, and performance (Demo Mode)</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/staff/applications">View Applications</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/staff/tiers">Manage Tiers</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Time Off</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Certs</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.full_name}</p>
                        <Badge variant="outline">{member.role}</Badge>
                        {member.instructor_tier && <Badge>{member.instructor_tier.name}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      {member.teaching_style && (
                        <p className="text-xs text-muted-foreground">Style: {member.teaching_style}</p>
                      )}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/staff/${member.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Time Off Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Dec 24, 2024 - Dec 26, 2024</p>
                      <p className="text-xs text-muted-foreground">Holiday vacation</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin/staff/time-off">Review</Link>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Jan 15, 2025 - Jan 17, 2025</p>
                      <p className="text-xs text-muted-foreground">Personal time</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin/staff/time-off">Review</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expiring Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">200-Hour YTT - Expires Jan 30, 2025</p>
                    </div>
                    <Badge variant="destructive">Expiring</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const { data: staff } = await supabase
    .from("profiles")
    .select(`
      *,
      instructor_tier:instructor_tiers(name, level),
      certifications(count),
      time_off_requests(count)
    `)
    .in("role", ["instructor", "staff"])
    .order("full_name")

  const { data: pendingTimeOff } = await supabase.from("time_off_requests").select("*").eq("status", "pending")

  const { data: expiringCerts } = await supabase
    .from("certifications")
    .select("*, instructor:profiles(full_name)")
    .gte("expiration_date", new Date().toISOString())
    .lte("expiration_date", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage instructors, schedules, and performance</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/staff/applications">View Applications</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/staff/tiers">Manage Tiers</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Time Off</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTimeOff?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Certs</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringCerts?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staff?.map((member) => (
                <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.full_name}</p>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.instructor_tier && <Badge>{member.instructor_tier.name}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {member.teaching_style && (
                      <p className="text-xs text-muted-foreground">Style: {member.teaching_style}</p>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/staff/${member.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Time Off Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTimeOff?.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{request.reason}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/staff/time-off`}>Review</Link>
                    </Button>
                  </div>
                ))}
                {(!pendingTimeOff || pendingTimeOff.length === 0) && (
                  <p className="text-sm text-muted-foreground">No pending requests</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expiring Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringCerts?.slice(0, 5).map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{cert.instructor?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cert.name} - Expires {new Date(cert.expiration_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="destructive">Expiring</Badge>
                  </div>
                ))}
                {(!expiringCerts || expiringCerts.length === 0) && (
                  <p className="text-sm text-muted-foreground">No expiring certifications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
