"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Video, Play, Clock, Calendar, Users, Search, Filter, Star } from "lucide-react"
import Link from "next/link"

export default function VirtualStudioPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for virtual classes
  const liveClasses = [
    {
      id: 1,
      title: "Morning Vinyasa Flow",
      instructor: "Sarah Chen",
      time: "Starting in 15 minutes",
      duration: "60 min",
      level: "All Levels",
      participants: 24,
      thumbnail: "/yoga-sunrise-flow.jpg",
    },
    {
      id: 2,
      title: "Power Yoga",
      instructor: "Michael Torres",
      time: "Starting in 45 minutes",
      duration: "75 min",
      level: "Intermediate",
      participants: 18,
      thumbnail: "/power-yoga-class.png",
    },
    {
      id: 3,
      title: "Gentle Evening Yin",
      instructor: "Lisa Anderson",
      time: "Starting in 2 hours",
      duration: "60 min",
      level: "Beginner",
      participants: 31,
      thumbnail: "/yin-yoga-evening.jpg",
    },
  ]

  const onDemandVideos = [
    {
      id: 1,
      title: "Core Strength Builder",
      instructor: "Sarah Chen",
      duration: "30 min",
      level: "Intermediate",
      views: 1248,
      rating: 4.8,
      thumbnail: "/yoga-core-workout.jpg",
      category: "Strength",
    },
    {
      id: 2,
      title: "Deep Stretch & Release",
      instructor: "Lisa Anderson",
      duration: "45 min",
      level: "All Levels",
      views: 2103,
      rating: 4.9,
      thumbnail: "/yoga-stretching.png",
      category: "Flexibility",
    },
    {
      id: 3,
      title: "Morning Energy Flow",
      instructor: "Michael Torres",
      duration: "60 min",
      level: "Intermediate",
      views: 1876,
      rating: 4.7,
      thumbnail: "/morning-yoga-energy.jpg",
      category: "Vinyasa",
    },
    {
      id: 4,
      title: "Bedtime Relaxation",
      instructor: "Emma Williams",
      duration: "20 min",
      level: "Beginner",
      views: 3421,
      rating: 5.0,
      thumbnail: "/bedtime-yoga-relaxation.jpg",
      category: "Restorative",
    },
    {
      id: 5,
      title: "Hip Opening Flow",
      instructor: "Sarah Chen",
      duration: "40 min",
      level: "All Levels",
      views: 1654,
      rating: 4.8,
      thumbnail: "/hip-opener-yoga.jpg",
      category: "Flexibility",
    },
    {
      id: 6,
      title: "Meditation Basics",
      instructor: "David Kumar",
      duration: "15 min",
      level: "Beginner",
      views: 2891,
      rating: 4.9,
      thumbnail: "/mindful-meditation.png",
      category: "Meditation",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Virtual Studio</h1>
        <p className="text-muted-foreground">
          Practice yoga from anywhere with our live streaming classes and on-demand video library
        </p>
      </div>

      <Tabs defaultValue="live" className="space-y-6">
        <TabsList>
          <TabsTrigger value="live">Live Classes</TabsTrigger>
          <TabsTrigger value="on-demand">On-Demand Library</TabsTrigger>
          <TabsTrigger value="recordings">My Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Live Classes</CardTitle>
              <CardDescription>
                Join our instructors for live virtual classes with real-time interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {liveClasses.map((classItem) => (
                  <Card key={classItem.id} className="overflow-hidden">
                    <img
                      src={classItem.thumbnail || "/placeholder.svg"}
                      alt={classItem.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{classItem.title}</h3>
                        <Badge variant="destructive" className="animate-pulse">
                          LIVE
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">with {classItem.instructor}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {classItem.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {classItem.participants}
                        </div>
                      </div>
                      <Badge variant="secondary" className="mb-4">
                        {classItem.level}
                      </Badge>
                      <p className="text-sm font-medium mb-3">{classItem.time}</p>
                      <Button className="w-full" asChild>
                        <Link href={`/virtual-studio/live/${classItem.id}`}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Class
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="on-demand" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {onDemandVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="lg" className="rounded-full h-16 w-16">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2">{video.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">with {video.instructor}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {video.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{video.level}</Badge>
                    <span className="text-sm text-muted-foreground">{video.views.toLocaleString()} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Class Recordings</CardTitle>
              <CardDescription>Access recordings of classes you've attended (available for 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  {
                    title: "Morning Vinyasa Flow",
                    instructor: "Sarah Chen",
                    date: "2024-01-15",
                    duration: "60 min",
                  },
                  {
                    title: "Restorative Yoga",
                    instructor: "Lisa Anderson",
                    date: "2024-01-12",
                    duration: "75 min",
                  },
                  {
                    title: "Power Yoga",
                    instructor: "Michael Torres",
                    date: "2024-01-10",
                    duration: "60 min",
                  },
                ].map((recording, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-24 bg-muted rounded flex items-center justify-center">
                          <Play className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{recording.title}</h4>
                          <p className="text-sm text-muted-foreground">with {recording.instructor}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {recording.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {recording.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button>Watch</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
