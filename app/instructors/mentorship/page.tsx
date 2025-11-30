"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle, Calendar, TrendingUp, Award, BookOpen } from "lucide-react"

export default function MentorshipPage() {
  const mentorshipOpportunities = [
    {
      id: "mentor-1",
      name: "Sarah Johnson",
      role: "Senior Instructor (10+ years)",
      specialties: ["Vinyasa", "Hatha", "Teacher Training"],
      avatar: "/yoga-instructor-woman.png",
      menteeCount: 3,
      availableSpots: 2,
      bio: "Passionate about helping new instructors develop their teaching voice and build confidence.",
      matchScore: 95,
    },
    {
      id: "mentor-2",
      name: "David Kim",
      role: "Master Teacher (15+ years)",
      specialties: ["Ashtanga", "Advanced Practice", "Anatomy"],
      avatar: "/yoga-instructor-man-2.jpg",
      menteeCount: 2,
      availableSpots: 1,
      bio: "Focused on deepening understanding of traditional practices and advanced techniques.",
      matchScore: 87,
    },
    {
      id: "mentor-3",
      name: "Emma Rodriguez",
      role: "Power Yoga Specialist (8+ years)",
      specialties: ["Power Yoga", "Strength Building", "Marketing"],
      avatar: "/yoga-instructor-woman-2.jpg",
      menteeCount: 4,
      availableSpots: 1,
      bio: "Help instructors build dynamic classes and grow their student base.",
      matchScore: 82,
    },
  ]

  const myMentorships = [
    {
      type: "mentor",
      name: "Lisa Martinez",
      role: "New Instructor",
      startDate: "2024-11-15",
      sessionsCompleted: 6,
      nextSession: "2025-02-05",
      progress: 60,
    },
    {
      type: "mentee",
      name: "Sarah Johnson",
      role: "Senior Instructor",
      startDate: "2024-10-01",
      sessionsCompleted: 12,
      nextSession: "2025-02-03",
      progress: 80,
    },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Mentorship Program</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Mentorships</CardTitle>
              <CardDescription>Active mentoring relationships</CardDescription>
            </CardHeader>
            <CardContent>
              {myMentorships.length > 0 ? (
                <div className="space-y-4">
                  {myMentorships.map((mentorship, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <Badge variant={mentorship.type === "mentor" ? "default" : "secondary"}>
                            {mentorship.type === "mentor" ? "Mentoring" : "Learning from"}
                          </Badge>
                          <div className="font-semibold mt-2">{mentorship.name}</div>
                          <div className="text-sm text-muted-foreground">{mentorship.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{mentorship.sessionsCompleted}</div>
                          <div className="text-xs text-muted-foreground">Sessions</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Next Session</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(mentorship.nextSession).toLocaleDateString()}
                          </div>
                        </div>
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active mentorships yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Find a Mentor</CardTitle>
              <CardDescription>Connect with experienced instructors to accelerate your growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentorshipOpportunities.map((mentor) => (
                  <div key={mentor.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{mentor.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {mentor.matchScore}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{mentor.role}</p>
                        </div>
                        <Award className="h-5 w-5 text-yellow-500" />
                      </div>
                      <p className="text-sm mb-3">{mentor.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mentor.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {mentor.menteeCount} active mentees • {mentor.availableSpots} spots available
                        </div>
                        <Button size="sm">Request Mentorship</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Mentorship Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Mentorship Guidelines
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Goal Setting Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Communication Tips
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Become a Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your experience and help new instructors grow. Mentors receive:
                </p>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Professional development credit
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Teaching credential advancement
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Community recognition
                  </li>
                </ul>
                <Button className="w-full">Apply to Be a Mentor</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
