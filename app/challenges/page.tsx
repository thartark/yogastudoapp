"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Users, Calendar, CheckCircle, Flame, Award } from "lucide-react"

export default function ChallengesPage() {
  const [joined, setJoined] = useState<number[]>([1])

  const activeChallenges = [
    {
      id: 1,
      title: "30 Days of Yoga",
      description: "Practice yoga every day for 30 consecutive days",
      duration: "30 days",
      participants: 45,
      progress: 12,
      total: 30,
      reward: "30-Day Challenge Badge",
      daysLeft: 18,
    },
    {
      id: 2,
      title: "Morning Warrior",
      description: "Attend 10 morning classes before 8am",
      duration: "60 days",
      participants: 23,
      progress: 3,
      total: 10,
      reward: "Early Bird Badge + Free Class",
      daysLeft: 52,
    },
  ]

  const upcomingChallenges = [
    {
      id: 3,
      title: "Flexibility Focus",
      description: "Complete 15 stretching or yin yoga sessions",
      duration: "30 days",
      startsIn: "5 days",
      reward: "Flexibility Master Badge",
      participants: 12,
    },
    {
      id: 4,
      title: "Strength Builder",
      description: "Attend 12 power yoga or strength classes",
      duration: "45 days",
      startsIn: "12 days",
      reward: "Power Yogi Badge + 15% Shop Discount",
      participants: 8,
    },
  ]

  const completedChallenges = [
    {
      id: 5,
      title: "7 Day Starter",
      completed: "2024-01-10",
      reward: "Beginner Badge",
    },
    {
      id: 6,
      title: "Weekend Warrior",
      completed: "2023-12-20",
      reward: "Weekend Yogi Badge",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Yoga Challenges</h1>
        <p className="text-muted-foreground">Join challenges, track your progress, and earn rewards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Badges Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 more this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Active Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{joined.length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {activeChallenges.map((challenge) => {
            const isJoined = joined.includes(challenge.id)
            const progressPercent = (challenge.progress / challenge.total) * 100

            return (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{challenge.title}</CardTitle>
                        {isJoined && <Badge variant="secondary">Joined</Badge>}
                      </div>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                    {!isJoined && <Button onClick={() => setJoined([...joined, challenge.id])}>Join Challenge</Button>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isJoined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Progress: {challenge.progress} / {challenge.total}
                        </span>
                        <span className="text-muted-foreground">{Math.round(progressPercent)}% complete</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{challenge.duration}</p>
                        <p className="text-muted-foreground text-xs">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{challenge.participants}</p>
                        <p className="text-muted-foreground text-xs">Participants</p>
                      </div>
                    </div>
                    {isJoined && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{challenge.daysLeft} days</p>
                          <p className="text-muted-foreground text-xs">Remaining</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-xs">{challenge.reward}</p>
                        <p className="text-muted-foreground text-xs">Reward</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{challenge.title}</CardTitle>
                      <Badge variant="outline">Starts in {challenge.startsIn}</Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <Button variant="outline">Notify Me</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{challenge.duration}</p>
                      <p className="text-muted-foreground text-xs">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{challenge.participants} interested</p>
                      <p className="text-muted-foreground text-xs">Pre-registered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-xs">{challenge.reward}</p>
                      <p className="text-muted-foreground text-xs">Reward</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedChallenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground">Completed on {challenge.completed}</p>
                  </div>
                </div>
                <Badge variant="secondary">{challenge.reward}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
