"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, CreditCard, TrendingUp, Package, Award, DollarSign, Activity } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { getMockData } = useMockData()
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClasses: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    activeMemberships: 0,
    upcomingWorkshops: 0,
    productsSold: 0,
    averageAttendance: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()

    // Calculate stats
    const totalClients = data.clients?.length || 0
    const activeClasses = data.classes?.length || 0
    const totalBookings = data.bookings?.filter((b: any) => b.status === "confirmed").length || 0
    const activeMemberships = data.memberships?.filter((m: any) => m.status === "active").length || 0
    const upcomingWorkshops = data.workshops?.length || 0

    // Calculate monthly revenue
    const monthlyRevenue =
      (data.memberships?.reduce((sum: number, m: any) => {
        if (m.status === "active") {
          const type = data.membershipTypes?.find((t: any) => t.id === m.membership_type_id)
          return sum + (type?.price || 0)
        }
        return sum
      }, 0) || 0) +
      (data.bookings?.filter((b: any) => b.status === "confirmed").length || 0) * 25

    // Calculate average attendance
    const averageAttendance = data.classInstances?.length
      ? Math.round(
          (data.classInstances.reduce((sum: number, ci: any) => sum + (ci.booked_count || 0), 0) /
            data.classInstances.length) *
            100,
        ) / 100
      : 0

    setStats({
      totalClients,
      activeClasses,
      totalBookings,
      monthlyRevenue,
      activeMemberships,
      upcomingWorkshops,
      productsSold: 156,
      averageAttendance,
    })

    // Get recent activity
    const recentBookings =
      data.bookings
        ?.slice(-5)
        .reverse()
        .map((booking: any) => {
          const instance = data.classInstances?.find((ci: any) => ci.id === booking.class_instance_id)
          const client = data.clients?.find((c: any) => c.id === booking.user_id)
          return {
            type: "booking",
            title: `New booking for ${instance?.class_name || "Unknown"}`,
            user: client?.full_name || "Unknown",
            time: booking.created_at,
          }
        }) || []

    setRecentActivity(recentBookings)
  }, [getMockData])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">Available to book</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMemberships}</div>
            <p className="text-xs text-muted-foreground">Current subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Workshops</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingWorkshops}</div>
            <p className="text-xs text-muted-foreground">Events scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsSold}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}</div>
            <p className="text-xs text-muted-foreground">Per class</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.title}</p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-transparent" variant="outline" asChild>
              <Link href="/admin/classes/new">Create New Class</Link>
            </Button>
            <Button className="w-full bg-transparent" variant="outline" asChild>
              <Link href="/admin/instructors">Manage Instructors</Link>
            </Button>
            <Button className="w-full bg-transparent" variant="outline" asChild>
              <Link href="/admin/memberships">View Memberships</Link>
            </Button>
            <Button className="w-full bg-transparent" variant="outline" asChild>
              <Link href="/admin/clients">Manage Clients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
