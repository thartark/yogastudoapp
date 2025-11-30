"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Send, Clock } from "lucide-react"

export default function SMSPage() {
  const [automations, setAutomations] = useState([
    { id: "1", name: "Class Reminder - 1 Hour", enabled: true, sent: 1250 },
    { id: "2", name: "Class Reminder - 24 Hours", enabled: true, sent: 980 },
    { id: "3", name: "Membership Expiring", enabled: true, sent: 45 },
    { id: "4", name: "Booking Confirmation", enabled: true, sent: 2100 },
    { id: "5", name: "Waitlist Spot Available", enabled: false, sent: 15 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SMS Messaging</h1>
          <p className="text-muted-foreground">Send text message reminders and notifications</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,390</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{automations.filter((a) => a.enabled).length}</div>
            <p className="text-xs text-muted-foreground">Enabled workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cost This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$87.80</div>
            <p className="text-xs text-muted-foreground">At $0.02 per message</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send One-Time SMS</CardTitle>
            <CardDescription>Send a text message to selected clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Input placeholder="Search clients by name or tag" />
              <div className="flex gap-2 flex-wrap mt-2">
                <Badge>All Active Members (124)</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Type your message here..." className="min-h-[120px]" maxLength={160} />
              <p className="text-xs text-muted-foreground">160 characters remaining</p>
            </div>

            <div className="space-y-2">
              <Label>Send Time</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Now
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Schedule
                </Button>
              </div>
            </div>

            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send SMS to 124 Recipients
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Last 5 SMS campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">Weekend Workshop Promo</p>
                <p className="text-xs text-muted-foreground">Sent to 85 clients - 2 hours ago</p>
              </div>
              <Badge variant="secondary">98% delivered</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">Class Cancellation Alert</p>
                <p className="text-xs text-muted-foreground">Sent to 22 clients - 5 hours ago</p>
              </div>
              <Badge variant="secondary">100% delivered</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">Membership Renewal Reminder</p>
                <p className="text-xs text-muted-foreground">Sent to 34 clients - Yesterday</p>
              </div>
              <Badge variant="secondary">97% delivered</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Automated SMS Workflows
          </CardTitle>
          <CardDescription>Automatic text messages triggered by events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {automations.map((automation) => (
            <div key={automation.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Switch checked={automation.enabled} />
                <div>
                  <p className="font-medium">{automation.name}</p>
                  <p className="text-sm text-muted-foreground">{automation.sent} sent this month</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Templates</CardTitle>
          <CardDescription>Pre-written message templates for quick sending</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">Class Reminder</p>
            <p className="text-sm text-muted-foreground mt-1">
              Hi {"{name}"}, your {"{class}"} class starts in 1 hour at {"{time}"}. See you soon!
            </p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">Membership Expiring</p>
            <p className="text-sm text-muted-foreground mt-1">
              Hi {"{name}"}, your membership expires in 7 days. Renew now to keep your benefits!
            </p>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            Add New Template
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
