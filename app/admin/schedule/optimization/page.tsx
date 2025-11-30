"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"
import { getMockData } from "@/lib/mock-data"

export default function ScheduleOptimizationPage() {
  const mockData = getMockData()

  const suggestions = [
    {
      type: "high_demand",
      severity: "high",
      title: "High Demand Time Slot Underutilized",
      description: "Tuesday 6:00 PM has high attendance but limited class options. Consider adding another class.",
      action: "Add Evening Class",
      impact: "+15 potential bookings/week",
    },
    {
      type: "low_attendance",
      severity: "medium",
      title: "Low Attendance Pattern",
      description: "Friday 2:00 PM Yin Yoga consistently has low attendance (avg 4/15 spots).",
      action: "Reschedule or Replace",
      impact: "Improve utilization by 60%",
    },
    {
      type: "instructor_load",
      severity: "low",
      title: "Instructor Load Imbalance",
      description: "Emma Rodriguez teaches 18 classes/week while Michael Chen teaches 8. Consider rebalancing.",
      action: "Redistribute Classes",
      impact: "Better work-life balance",
    },
    {
      type: "capacity",
      severity: "high",
      title: "Capacity Constraints",
      description: "Power Yoga classes fill to capacity 95% of the time. Increase capacity or add sessions.",
      action: "Add Class or Larger Room",
      impact: "+12 potential bookings/week",
    },
  ]

  const metrics = {
    avgUtilization: 68,
    peakTimes: ["6:00 AM", "12:00 PM", "6:00 PM"],
    lowTimes: ["2:00 PM", "3:00 PM"],
    topClasses: ["Power Yoga", "Vinyasa Flow", "Hot Yoga"],
    underperforming: ["Yin Yoga (Fri 2PM)", "Hatha Basics (Mon 11AM)"],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Schedule Optimization</h1>
        <p className="text-muted-foreground">AI-powered insights to optimize your schedule</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgUtilization}%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Times</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.peakTimes.length}</div>
            <p className="text-xs text-muted-foreground">{metrics.peakTimes.join(", ")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Classes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.topClasses.length}</div>
            <p className="text-xs text-muted-foreground">{metrics.topClasses[0]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Underperforming</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.underperforming.length}</div>
            <p className="text-xs text-muted-foreground">Classes need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Suggestions</CardTitle>
          <CardDescription>Actionable recommendations based on historical data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="mt-1">
                  {suggestion.severity === "high" ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : suggestion.severity === "medium" ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{suggestion.title}</h3>
                    <Badge
                      variant={
                        suggestion.severity === "high"
                          ? "destructive"
                          : suggestion.severity === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {suggestion.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm">{suggestion.action}</Button>
                    <span className="text-sm text-muted-foreground">{suggestion.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
