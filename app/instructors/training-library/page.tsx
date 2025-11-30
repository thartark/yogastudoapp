"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Search, Filter } from "lucide-react"

export default function TrainingLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const trainingContent = [
    {
      id: "train-1",
      title: "Advanced Sequencing Techniques",
      type: "video",
      duration: "45 min",
      category: "Teaching Skills",
      difficulty: "Advanced",
      thumbnail: "/placeholder.svg?height=200&width=300",
      instructor: "Sarah Johnson",
      views: 245,
    },
    {
      id: "train-2",
      title: "Verbal Cueing Mastery",
      type: "video",
      duration: "30 min",
      category: "Communication",
      difficulty: "Intermediate",
      thumbnail: "/placeholder.svg?height=200&width=300",
      instructor: "Michael Chen",
      views: 189,
    },
    {
      id: "train-3",
      title: "Anatomy for Yoga Teachers",
      type: "article",
      duration: "15 min read",
      category: "Anatomy",
      difficulty: "All Levels",
      thumbnail: "/placeholder.svg?height=200&width=300",
      instructor: "Emma Rodriguez",
      views: 412,
    },
    {
      id: "train-4",
      title: "Hands-On Adjustments Guide",
      type: "video",
      duration: "60 min",
      category: "Teaching Skills",
      difficulty: "Advanced",
      thumbnail: "/placeholder.svg?height=200&width=300",
      instructor: "David Kim",
      views: 328,
    },
    {
      id: "train-5",
      title: "Building Your Teaching Style",
      type: "article",
      duration: "10 min read",
      category: "Professional Development",
      difficulty: "All Levels",
      thumbnail: "/placeholder.svg?height=200&width=300",
      instructor: "Lisa Martinez",
      views: 567,
    },
    {
      id: "train-6",
      title: "Music & Playlisting for Classes",
      type: "video",
      duration: "25 min",
      category: "Teaching Skills",
      difficulty: "Beginner",
      thumbnail: "/placeholder.svg?height=200&width=300",
      instructor: "Sarah Johnson",
      views: 201,
    },
  ]

  const categories = Array.from(new Set(trainingContent.map((t) => t.category)))

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Training Library</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search training content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              All Content
            </Button>
            {categories.map((category) => (
              <Button key={category} variant="ghost" size="sm">
                {category}
              </Button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainingContent.map((content) => (
              <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative aspect-video bg-muted">
                  <img
                    src={content.thumbnail || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      {content.type}
                    </Badge>
                  </div>
                  {content.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {content.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {content.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{content.duration}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">By {content.instructor}</div>
                    <div className="text-xs text-muted-foreground">{content.views} views</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
