"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Key, Lock, Unlock, Clock } from "lucide-react"

export default function AccessControlPage() {
  const [accessRules, setAccessRules] = useState([
    { id: "1", name: "Active Members - 24/7", enabled: true, members: 124 },
    { id: "2", name: "Staff Access - Always", enabled: true, members: 8 },
    { id: "3", name: "Trial Members - Class Hours Only", enabled: true, members: 12 },
    { id: "4", name: "Guest Pass - Single Entry", enabled: true, members: 5 },
  ])

  const [recentActivity, setRecentActivity] = useState([
    { name: "John Doe", action: "Entered", time: "2 minutes ago", door: "Main Entrance" },
    { name: "Mary Smith", action: "Entered", time: "15 minutes ago", door: "Main Entrance" },
    { name: "Alex Wong", action: "Exited", time: "30 minutes ago", door: "Main Entrance" },
    { name: "Sarah Johnson", action: "Entered", time: "1 hour ago", door: "Staff Door" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Door Access Control</h1>
          <p className="text-muted-foreground">Manage keyless entry and access permissions</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">149</div>
            <p className="text-xs text-muted-foreground">Members with access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">Access events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Denied access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="gap-1">
              <Unlock className="h-3 w-3" />
              Online
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grant Access</CardTitle>
            <CardDescription>Add door access for a member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Member</Label>
              <Input placeholder="Search by name or email" />
            </div>

            <div className="space-y-2">
              <Label>Access Level</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">24/7 Access</p>
                    <p className="text-xs text-muted-foreground">Unrestricted entry</p>
                  </div>
                  <input type="radio" name="access" value="247" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Class Hours Only</p>
                    <p className="text-xs text-muted-foreground">6am - 10pm daily</p>
                  </div>
                  <input type="radio" name="access" value="hours" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Guest Pass</p>
                    <p className="text-xs text-muted-foreground">Single entry token</p>
                  </div>
                  <input type="radio" name="access" value="guest" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Input type="date" />
            </div>

            <Button className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Grant Access
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Real-time door access log</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {activity.action === "Entered" ? (
                    <Unlock className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action} - {activity.door}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{activity.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Rules</CardTitle>
          <CardDescription>Configure automatic access permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {accessRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <Switch checked={rule.enabled} />
                <div className="flex-1">
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-muted-foreground">{rule.members} members affected</p>
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
          <CardTitle>Door Locations</CardTitle>
          <CardDescription>Manage physical door access points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Main Entrance</p>
                <p className="text-sm text-muted-foreground">Front lobby access</p>
              </div>
            </div>
            <Badge variant="secondary">Online</Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Staff Door</p>
                <p className="text-sm text-muted-foreground">Employee and instructor access</p>
              </div>
            </div>
            <Badge variant="secondary">Online</Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Back Exit</p>
                <p className="text-sm text-muted-foreground">Emergency exit only</p>
              </div>
            </div>
            <Badge variant="secondary">Online</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>Connect with door access hardware</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Smart Lock System</p>
              <p className="text-sm text-muted-foreground">August, Schlage, Yale compatible</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mobile App Access</p>
              <p className="text-sm text-muted-foreground">Allow members to unlock via smartphone</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
