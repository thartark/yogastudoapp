"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Upload, BarChart3, Play, Edit, Trash2, Eye, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminVirtualPage() {
  const videoLibrary = [
    {
      id: 1,
      title: "Core Strength Builder",
      instructor: "Sarah Chen",
      duration: "30 min",
      views: 1248,
      status: "published",
      uploadDate: "2024-01-10",
    },
    {
      id: 2,
      title: "Deep Stretch & Release",
      instructor: "Lisa Anderson",
      duration: "45 min",
      views: 2103,
      status: "published",
      uploadDate: "2024-01-08",
    },
    {
      id: 3,
      title: "Hip Opening Flow",
      instructor: "Sarah Chen",
      duration: "40 min",
      views: 1654,
      status: "draft",
      uploadDate: "2024-01-15",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Virtual Studio Management</h1>
          <p className="text-muted-foreground">Manage live classes, on-demand videos, and streaming settings</p>
        </div>
        <Button asChild>
          <Link href="/admin/virtual/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+2,340 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Live Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Watch Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38 min</div>
            <p className="text-xs text-muted-foreground">+5 min vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Video Library</TabsTrigger>
          <TabsTrigger value="live">Live Streaming</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Library</CardTitle>
              <CardDescription>Manage your on-demand video content and recordings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videoLibrary.map((video) => (
                  <Card key={video.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-28 bg-muted rounded flex items-center justify-center">
                          <Play className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{video.title}</h4>
                            <Badge variant={video.status === "published" ? "default" : "secondary"}>
                              {video.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {video.instructor} • {video.duration}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {video.views.toLocaleString()} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.uploadDate}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Streaming Setup</CardTitle>
              <CardDescription>Configure your live streaming integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded flex items-center justify-center">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Zoom Integration</h4>
                    <p className="text-sm text-muted-foreground">Connect your Zoom account for live classes</p>
                  </div>
                </div>
                <Button>Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-red-100 rounded flex items-center justify-center">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">YouTube Live</h4>
                    <p className="text-sm text-muted-foreground">Stream directly to YouTube</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Settings</CardTitle>
              <CardDescription>Configure video quality and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recording Retention</label>
                <p className="text-sm text-muted-foreground">
                  How long should class recordings be available to students?
                </p>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>7 days</option>
                  <option>14 days</option>
                  <option selected>30 days</option>
                  <option>90 days</option>
                  <option>Forever</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Quality</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>720p (HD)</option>
                  <option selected>1080p (Full HD)</option>
                  <option>4K (Ultra HD)</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Auto-record live classes</h4>
                  <p className="text-sm text-muted-foreground">Automatically save recordings of live classes</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
