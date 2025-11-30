"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { TrendingUp, Users, Calendar, DollarSign, Award, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminAnalyticsPage() {
  const { getMockData } = useMockData()
  const [analytics, setAnalytics] = useState<any>({
    revenue: { current: 0, previous: 0, trend: 0 },
    newMembers: { current: 0, previous: 0, trend: 0 },
    classAttendance: { current: 0, previous: 0, trend: 0 },
    topClasses: [],
    topInstructors: [],
    membershipBreakdown: [],
  })

  useEffect(() => {
    const data = getMockData()

    // Calculate revenue
    const currentRevenue =
      (data.memberships?.reduce((sum: number, m: any) => {
        if (m.status === "active") {
          const type = data.membershipTypes?.find((t: any) => t.id === m.membership_type_id)
          return sum + (type?.price || 0)
        }
        return sum
      }, 0) || 0) +
      (data.bookings?.filter((b: any) => b.status === "confirmed").length || 0) * 25

    // Top classes by bookings
    const classBookings = new Map()
    data.bookings?.forEach((booking: any) => {
      const instance = data.classInstances?.find((ci: any) => ci.id === booking.class_instance_id)
      if (instance) {
        const count = classBookings.get(instance.class_name) || 0
        classBookings.set(instance.class_name, count + 1)
      }
    })

    const topClasses = Array.from(classBookings.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top instructors by class count
    const instructorClasses = new Map()
    data.classes?.forEach((cls: any) => {
      const count = instructorClasses.get(cls.instructor_name) || 0
      instructorClasses.set(cls.instructor_name, count + 1)
    })

    const topInstructors = Array.from(instructorClasses.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Membership breakdown
    const membershipBreakdown =
      data.membershipTypes?.map((type: any) => {
        const count =
          data.memberships?.filter((m: any) => m.membership_type_id === type.id && m.status === "active").length || 0
        return {
          name: type.name,
          count,
          revenue: count * type.price,
        }
      }) || []

    setAnalytics({
      revenue: {
        current: currentRevenue,
        previous: currentRevenue * 0.85,
        trend: 15,
      },
      newMembers: {
        current: data.clients?.length || 0,
        previous: (data.clients?.length || 0) - 8,
        trend: 12,
      },
      classAttendance: {
        current: data.bookings?.filter((b: any) => b.status === "confirmed").length || 0,
        previous: (data.bookings?.filter((b: any) => b.status === "confirmed").length || 0) - 45,
        trend: 18,
      },
      topClasses,
      topInstructors,
      membershipBreakdown,
    })
  }, [getMockData])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your studio performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue.current.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={analytics.revenue.trend > 0 ? "default" : "destructive"} className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {analytics.revenue.trend}%
              </Badge>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.newMembers.current}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={analytics.newMembers.trend > 0 ? "default" : "destructive"} className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {analytics.newMembers.trend}%
              </Badge>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Class Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.classAttendance.current}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={analytics.classAttendance.trend > 0 ? "default" : "destructive"} className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {analytics.classAttendance.trend}%
              </Badge>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topClasses.length > 0 ? (
              <div className="space-y-3">
                {analytics.topClasses.map((cls: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="font-medium">{cls.name}</p>
                    </div>
                    <Badge>{cls.count} bookings</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topInstructors.length > 0 ? (
              <div className="space-y-3">
                {analytics.topInstructors.map((instructor: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="font-medium">{instructor.name}</p>
                    </div>
                    <Badge>{instructor.count} classes</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Membership Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.membershipBreakdown.length > 0 ? (
            <div className="space-y-4">
              {analytics.membershipBreakdown.map((membership: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{membership.name}</p>
                    <p className="text-sm text-muted-foreground">{membership.count} active members</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${membership.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
