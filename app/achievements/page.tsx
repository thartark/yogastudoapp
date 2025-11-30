"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Award, Trophy, Star, Target, Flame, Heart } from "lucide-react"

const achievementIcons: Record<string, any> = {
  trophy: Trophy,
  star: Star,
  target: Target,
  flame: Flame,
  heart: Heart,
  award: Award,
}

export default function AchievementsPage() {
  const { getMockData } = useMockData()
  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [availableAchievements, setAvailableAchievements] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()
    const currentUserId = data.currentUser?.id

    // Get user's earned achievements
    const earned = data.achievements?.filter((a: any) => a.user_id === currentUserId) || []
    setUserAchievements(earned)

    // Create available achievements (not yet earned)
    const availableAchievementsList = [
      {
        id: "ach-future-1",
        title: "First Steps",
        description: "Complete your first yoga class",
        icon: "star",
        requirement: "Attend 1 class",
        earned: earned.length > 0,
      },
      {
        id: "ach-future-2",
        title: "Dedicated Yogi",
        description: "Attend 10 yoga classes",
        icon: "flame",
        requirement: "Attend 10 classes",
        earned: earned.length >= 2,
      },
      {
        id: "ach-future-3",
        title: "Monthly Warrior",
        description: "Practice yoga 4 times a week for a month",
        icon: "target",
        requirement: "16 classes in 30 days",
        earned: earned.length >= 3,
      },
      {
        id: "ach-future-4",
        title: "Meditation Master",
        description: "Complete 5 meditation or yin yoga classes",
        icon: "heart",
        requirement: "5 meditation classes",
        earned: earned.length >= 4,
      },
      {
        id: "ach-future-5",
        title: "Early Bird",
        description: "Attend 10 classes before 8 AM",
        icon: "trophy",
        requirement: "10 early morning classes",
        earned: false,
      },
      {
        id: "ach-future-6",
        title: "Community Champion",
        description: "Share 10 posts in the community",
        icon: "award",
        requirement: "10 community posts",
        earned: false,
      },
    ]

    setAvailableAchievements(availableAchievementsList)
  }, []) // Removed getMockData from dependencies to prevent infinite loop

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-2">Track your progress and earn badges for your dedication</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Earned Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAchievements.length}</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAchievements.length * 100}</div>
            <p className="text-xs text-muted-foreground">Experience points</p>
          </CardContent>
        </Card>
      </div>

      {userAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userAchievements.map((achievement: any) => {
              const IconComponent = achievementIcons[achievement.icon] || Award
              return (
                <Card key={achievement.id} className="border-primary bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <Badge variant="default">Earned</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Available Achievements</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableAchievements.map((achievement: any) => {
            const IconComponent = achievementIcons[achievement.icon] || Award
            return (
              <Card key={achievement.id} className={achievement.earned ? "border-primary" : "opacity-60"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? "bg-primary/20" : "bg-muted"
                        }`}
                      >
                        <IconComponent
                          className={`h-6 w-6 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    </div>
                    {achievement.earned && <Badge>Earned</Badge>}
                  </div>
                  <CardDescription className="mt-2">{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Requirement: {achievement.requirement}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
