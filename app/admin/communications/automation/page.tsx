"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Zap, Bell, Mail, MessageSquare } from "lucide-react"

export default function CommunicationAutomationPage() {
  const [automations, setAutomations] = useState([
    {
      id: "1",
      name: "Booking Confirmation",
      type: "email",
      trigger: "When client books a class",
      enabled: true,
      sent: 2145,
    },
    {
      id: "2",
      name: "Class Reminder - 24 Hours",
      type: "email",
      trigger: "24 hours before class start",
      enabled: true,
      sent: 1890,
    },
    {
      id: "3",
      name: "Class Reminder - 1 Hour",
      type: "sms",
      trigger: "1 hour before class start",
      enabled: true,
      sent: 1650,
    },
    {
      id: "4",
      name: "Membership Welcome Email",
      type: "email",
      trigger: "When membership is purchased",
      enabled: true,
      sent: 156,
    },
    {
      id: "5",
      name: "Membership Expiring Soon",
      type: "both",
      trigger: "7 days before expiration",
      enabled: true,
      sent: 89,
    },
    {
      id: "6",
      name: "Waitlist Notification",
      type: "sms",
      trigger: "When spot becomes available",
      enabled: true,
      sent: 42,
    },
    {
      id: "7",
      name: "Birthday Greeting",
      type: "email",
      trigger: "On client's birthday",
      enabled: true,
      sent: 18,
    },
    {
      id: "8",
      name: "No-Show Follow Up",
      type: "email",
      trigger: "After missed class",
      enabled: false,
      sent: 0,
    },
    {
      id: "9",
      name: "Feedback Request",
      type: "email",
      trigger: "After first class",
      enabled: true,
      sent: 125,
    },
    {
      id: "10",
      name: "Re-engagement Campaign",
      type: "email",
      trigger: "30 days of inactivity",
      enabled: true,
      sent: 67,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Automation</h1>
          <p className="text-muted-foreground">Automated messages triggered by events</p>
        </div>
        <Button>
          <Zap className="mr-2 h-4 w-4" />
          Create Automation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{automations.filter((a) => a.enabled).length}</div>
            <p className="text-xs text-muted-foreground">Running workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{automations.reduce((sum, a) => sum + a.sent, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,182</div>
            <p className="text-xs text-muted-foreground">Automated messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">69.7</div>
            <p className="text-xs text-muted-foreground">Hours this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Email Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.filter((a) => a.type === "email" || a.type === "both").length}
            </div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SMS Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.filter((a) => a.type === "sms" || a.type === "both").length}
            </div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Multi-Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automations.filter((a) => a.type === "both").length}</div>
            <p className="text-xs text-muted-foreground">Email + SMS</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Automations</CardTitle>
          <CardDescription>Manage your automated communication workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <Switch checked={automation.enabled} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{automation.name}</p>
                    {automation.type === "email" && <Mail className="h-4 w-4 text-muted-foreground" />}
                    {automation.type === "sms" && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
                    {automation.type === "both" && (
                      <>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{automation.trigger}</p>
                  <p className="text-xs text-muted-foreground mt-1">{automation.sent.toLocaleString()} sent</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Stats
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Popular Automation Templates
          </CardTitle>
          <CardDescription>Quick-start templates for common workflows</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">Welcome Series</p>
            <p className="text-xs text-muted-foreground mt-1">3-email sequence for new members</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Use Template
            </Button>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">Abandoned Cart</p>
            <p className="text-xs text-muted-foreground mt-1">Follow up on incomplete purchases</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Use Template
            </Button>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">Win-Back Campaign</p>
            <p className="text-xs text-muted-foreground mt-1">Re-engage inactive members</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Use Template
            </Button>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">Class Series Reminder</p>
            <p className="text-xs text-muted-foreground mt-1">Reminders for multi-week programs</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Use Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
