"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Star, TrendingUp, Clock, Users } from "lucide-react"
import Link from "next/link"
import { getMockData } from "@/lib/mock-data"

export default function RecommendationsPage() {
  const mockData = getMockData()

  const recommendations = {
    forYou: [
      {
        type: "class",
        id: "class-2",
        title: "Try Yin Yoga",
        reason: "Based on your preference for relaxing practices",
        confidence: 92,
        image: "/yin-yoga-class.jpg",
      },
      {
        type: "instructor",
        id: "instructor-5",
        title: "David Kim's Ashtanga",
        reason: "Students at your level love this instructor",
        confidence: 87,
        image: "/yoga-instructor-man-2.jpg",
      },
      {
        type: "time",
        id: "time-morning",
        title: "Morning Classes (6-9 AM)",
        reason: "85% of your bookings are in the morning",
        confidence: 95,
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    trending: [
      {
        id: "class-3",
        name: "Power Yoga",
        instructor: "Emma Rodriguez",
        bookingTrend: "+24% this week",
        avgRating: 4.8,
      },
      {
        id: "workshop-1",
        name: "Yoga for Beginners Workshop",
        instructor: "Sarah Johnson",
        bookingTrend: "Almost full",
        avgRating: 4.9,
      },
    ],
    similarUsers: [
      "Students like you also enjoy: Hot Yoga, Restorative Yoga",
      "Popular next step: Advanced Inversions Workshop",
    ],
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Recommendations</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Personalized For You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {recommendations.forYou.map((rec) => (
                  <Card key={rec.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img
                        src={rec.image || "/placeholder.svg"}
                        alt={rec.title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {rec.confidence}% match
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {rec.type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        <Button className="w-full" size="sm">
                          Explore
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.trending.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.instructor}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          {item.bookingTrend}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {item.avgRating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Similar Students Enjoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.similarUsers.map((insight, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/buddy-finder">
                      <Users className="h-4 w-4 mr-2" />
                      Find Practice Buddies
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Best Times for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Based on your booking history and class availability</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold">6:00 AM</div>
                  <div className="text-sm text-muted-foreground">Morning Energy</div>
                  <Badge variant="secondary" className="mt-2">
                    Your favorite
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold">12:00 PM</div>
                  <div className="text-sm text-muted-foreground">Lunch Break</div>
                  <Badge variant="outline" className="mt-2">
                    Less crowded
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold">6:00 PM</div>
                  <div className="text-sm text-muted-foreground">After Work</div>
                  <Badge variant="outline" className="mt-2">
                    Popular time
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
