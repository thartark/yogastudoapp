"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Award, Flame } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"

export default function LeaderboardPage() {
  const { getMockData } = useMockData()
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()

    // Create leaderboard from clients based on bookings
    const clientStats = (data.clients || []).map((client: any) => {
      const bookings = data.bookings?.filter((b: any) => b.user_id === client.id && b.checked_in) || []
      const achievements = data.achievements?.filter((a: any) => a.user_id === client.id) || []

      return {
        id: client.id,
        name: client.full_name,
        classes_attended: bookings.length,
        achievements: achievements.length,
        points: bookings.length * 10 + achievements.length * 100,
        streak: Math.floor(Math.random() * 15) + 1,
      }
    })

    // Sort by points
    clientStats.sort((a, b) => b.points - a.points)

    setLeaderboard(clientStats)
  }, [getMockData])

  const getRankBadge = (index: number) => {
    if (index === 0) return { variant: "default" as const, icon: Trophy, color: "text-yellow-500" }
    if (index === 1) return { variant: "secondary" as const, icon: Award, color: "text-gray-400" }
    if (index === 2) return { variant: "outline" as const, icon: Award, color: "text-orange-600" }
    return { variant: "outline" as const, icon: null, color: "" }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">See who's leading the way in our yoga community</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#1</div>
            <p className="text-xs text-muted-foreground">Out of {leaderboard.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard[0]?.points || 0}</div>
            <p className="text-xs text-muted-foreground">Total points earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard[0]?.streak || 0}</div>
            <p className="text-xs text-muted-foreground">Days in a row</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Practitioners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user: any, index: number) => {
              const rankBadge = getRankBadge(index)
              const RankIcon = rankBadge.icon

              return (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold">
                      {index < 3 && RankIcon ? (
                        <RankIcon className={`h-5 w-5 ${rankBadge.color}`} />
                      ) : (
                        <span>#{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.classes_attended} classes • {user.achievements} achievements
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{user.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
