"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Calendar, Users } from "lucide-react"

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState([
    {
      id: "1",
      name: "Monthly Newsletter - January",
      subject: "New Year, New You: January Class Schedule",
      status: "sent",
      recipients: 245,
      opens: 189,
      clicks: 67,
      sentAt: "2025-01-01",
    },
    {
      id: "2",
      name: "Workshop Announcement",
      subject: "Advanced Inversions Workshop - Early Bird Special",
      status: "scheduled",
      recipients: 180,
      scheduledFor: "2025-02-01",
    },
    {
      id: "3",
      name: "Membership Renewal Campaign",
      subject: "Your Membership is Expiring Soon",
      status: "draft",
      recipients: 0,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Campaigns</h1>
          <p className="text-muted-foreground">Create and manage email marketing campaigns</p>
        </div>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42.3%</div>
            <p className="text-xs text-muted-foreground">Above industry avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15.8%</div>
            <p className="text-xs text-muted-foreground">Engagement rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">Active email list</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Email Campaign</CardTitle>
          <CardDescription>Design and send email to your members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="Internal name for this campaign" />
            </div>
            <div className="space-y-2">
              <Label>Email Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="event">Event Invitation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Subject Line</Label>
            <Input placeholder="Write a compelling subject line..." />
          </div>

          <div className="space-y-2">
            <Label>Preview Text</Label>
            <Input placeholder="This appears in inbox preview..." />
          </div>

          <div className="space-y-2">
            <Label>Recipients</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Active Members (245)</SelectItem>
                <SelectItem value="new">New Members (42)</SelectItem>
                <SelectItem value="vip">VIP Members (18)</SelectItem>
                <SelectItem value="inactive">Inactive Members (35)</SelectItem>
                <SelectItem value="custom">Custom Segment...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email Body</Label>
            <Textarea placeholder="Write your email content..." className="min-h-[200px]" />
            <p className="text-xs text-muted-foreground">Use the template editor for rich formatting</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              Save as Draft
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Send Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>View and manage your email campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{campaign.name}</p>
                    <Badge
                      variant={
                        campaign.status === "sent"
                          ? "secondary"
                          : campaign.status === "scheduled"
                            ? "default"
                            : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                  {campaign.status === "sent" && (
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        <Users className="inline h-3 w-3 mr-1" />
                        {campaign.recipients} sent
                      </span>
                      <span className="text-muted-foreground">
                        <Mail className="inline h-3 w-3 mr-1" />
                        {campaign.opens} opens ({((campaign.opens! / campaign.recipients) * 100).toFixed(1)}%)
                      </span>
                      <span className="text-muted-foreground">
                        {campaign.clicks} clicks ({((campaign.clicks! / campaign.recipients) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {campaign.status === "scheduled" && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Scheduled for {new Date(campaign.scheduledFor!).toLocaleDateString()} to {campaign.recipients}{" "}
                      recipients
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {campaign.status === "draft" && <Button size="sm">Edit</Button>}
                  {campaign.status === "sent" && (
                    <Button size="sm" variant="outline">
                      View Report
                    </Button>
                  )}
                  {campaign.status === "scheduled" && (
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automated Email Sequences</CardTitle>
          <CardDescription>Set up drip campaigns and automated emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Welcome Series</p>
                <p className="text-sm text-muted-foreground">3 emails over 7 days for new members</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Active</Badge>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Re-engagement Campaign</p>
                <p className="text-sm text-muted-foreground">Win back inactive members after 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Active</Badge>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Create Automation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
