"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Copy, BarChart3 } from "lucide-react"

export default function LandingPagesPage() {
  const [pages, setPages] = useState([
    {
      id: "1",
      name: "New Member Promotion",
      url: "/promo/new-member-2025",
      status: "active",
      views: 1250,
      conversions: 42,
      conversionRate: 3.4,
    },
    {
      id: "2",
      name: "Workshop Registration",
      url: "/workshops/inversions",
      status: "active",
      views: 680,
      conversions: 28,
      conversionRate: 4.1,
    },
    {
      id: "3",
      name: "Summer Membership Sale",
      url: "/promo/summer-2024",
      status: "archived",
      views: 3200,
      conversions: 156,
      conversionRate: 4.9,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landing Pages</h1>
          <p className="text-muted-foreground">Create custom pages for campaigns and promotions</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          New Landing Page
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pages.filter((p) => p.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Live landing pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pages.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pages.reduce((sum, p) => sum + p.conversions, 0)}</div>
            <p className="text-xs text-muted-foreground">Total sign-ups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Conv Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(pages.reduce((sum, p) => sum + p.conversionRate, 0) / pages.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Average across pages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Landing Page</CardTitle>
            <CardDescription>Build a custom page for your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Name</Label>
              <Input placeholder="e.g., Spring Sale 2025" />
            </div>

            <div className="space-y-2">
              <Label>URL Slug</Label>
              <div className="flex gap-2">
                <span className="flex items-center text-sm text-muted-foreground px-3 border rounded-md bg-muted">
                  pranaplanner.com/
                </span>
                <Input placeholder="spring-sale" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Template</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-xs">Simple Form</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-xs">Promo Hero</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-xs">Event Details</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col bg-transparent">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-xs">Testimonials</span>
                </Button>
              </div>
            </div>

            <Button className="w-full">Create Landing Page</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Builder Features</CardTitle>
            <CardDescription>Tools available in the landing page editor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Drag & Drop Builder</p>
                <p className="text-xs text-muted-foreground">Easy visual page creation</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Analytics Tracking</p>
                <p className="text-xs text-muted-foreground">Automatic conversion tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Copy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">A/B Testing</p>
                <p className="text-xs text-muted-foreground">Test variations to optimize</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Landing Pages</CardTitle>
          <CardDescription>Manage and track your landing page performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{page.name}</p>
                      <Badge variant={page.status === "active" ? "default" : "secondary"}>{page.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{page.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{page.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conversions</p>
                    <p className="font-semibold">{page.conversions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Conv. Rate</p>
                    <p className="font-semibold">{page.conversionRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pre-built Templates</CardTitle>
          <CardDescription>Start with proven landing page designs</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600" />
            <div className="p-4">
              <p className="font-medium">Membership Sale</p>
              <p className="text-sm text-muted-foreground mb-3">Perfect for limited-time offers</p>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                Use Template
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-green-500 to-teal-600" />
            <div className="p-4">
              <p className="font-medium">Workshop Sign-up</p>
              <p className="text-sm text-muted-foreground mb-3">Great for special events</p>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                Use Template
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-orange-500 to-red-600" />
            <div className="p-4">
              <p className="font-medium">Free Trial</p>
              <p className="text-sm text-muted-foreground mb-3">Convert first-time visitors</p>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
