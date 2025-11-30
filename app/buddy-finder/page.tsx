"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Calendar, Heart, MessageCircle } from "lucide-react"
import { useState } from "react"

export default function BuddyFinderPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const buddyMatches = [
    {
      id: 1,
      name: "Emma Johnson",
      avatar: "/placeholder.svg?key=avatar1",
      level: "Intermediate",
      favoriteStyle: "Vinyasa",
      availability: "Mornings",
      matchScore: 95,
      commonClasses: 8,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?key=avatar2",
      level: "Beginner",
      favoriteStyle: "Hatha",
      availability: "Evenings",
      matchScore: 87,
      commonClasses: 5,
    },
    {
      id: 3,
      name: "Sophie Williams",
      avatar: "/placeholder.svg?key=avatar3",
      level: "Advanced",
      favoriteStyle: "Ashtanga",
      availability: "Weekends",
      matchScore: 82,
      commonClasses: 3,
    },
    {
      id: 4,
      name: "James Miller",
      avatar: "/placeholder.svg?key=avatar4",
      level: "Intermediate",
      favoriteStyle: "Power Yoga",
      availability: "Mornings",
      matchScore: 78,
      commonClasses: 6,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Practice Buddy Finder</h1>
        <p className="text-muted-foreground">Find practice partners with similar schedules and interests</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your Practice Buddies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Connected partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Classes Together</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">New Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Potential buddies</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, style, or availability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {buddyMatches.map((buddy) => (
              <Card key={buddy.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={buddy.avatar || "/placeholder.svg"} alt={buddy.name} />
                      <AvatarFallback>
                        {buddy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{buddy.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{buddy.level}</Badge>
                            <span>•</span>
                            <span>Loves {buddy.favoriteStyle}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{buddy.matchScore}%</div>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{buddy.availability}</p>
                            <p className="text-muted-foreground text-xs">Availability</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{buddy.commonClasses} classes</p>
                            <p className="text-muted-foreground text-xs">Common interest</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button>
                          <Users className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
