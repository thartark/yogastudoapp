"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Flame, Target, TrendingUp } from "lucide-react"

export default function HabitsPage() {
  const [habits] = useState([
    {
      id: "habit-1",
      name: "Morning Practice",
      goal: "Practice yoga 5 days per week",
      currentStreak: 12,
      longestStreak: 18,
      completedThisWeek: 4,
      targetPerWeek: 5,
      history: [true, true, false, true, true, false, true],
    },
    {
      id: "habit-2",
      name: "Meditation",
      goal: "Meditate for 10 minutes daily",
      currentStreak: 7,
      longestStreak: 15,
      completedThisWeek: 6,
      targetPerWeek: 7,
      history: [true, true, true, true, true, true, false],
    },
    {
      id: "habit-3",
      name: "Hydration",
      goal: "Drink 8 glasses of water daily",
      currentStreak: 3,
      longestStreak: 21,
      completedThisWeek: 5,
      targetPerWeek: 7,
      history: [true, false, true, true, false, true, true],
    },
  ])

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Habit Tracking</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{habits.length}</div>
                <p className="text-xs text-muted-foreground">Tracking daily</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                <Flame className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.max(...habits.map((h) => h.longestStreak))} days</div>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {habits.map((habit) => (
              <Card key={habit.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{habit.name}</h3>
                        <p className="text-sm text-muted-foreground">{habit.goal}</p>
                      </div>
                      <Button size="sm">
                        <Check className="h-4 w-4 mr-2" />
                        Complete Today
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <div>
                          <div className="text-sm font-medium">{habit.currentStreak} day streak</div>
                          <div className="text-xs text-muted-foreground">Best: {habit.longestStreak} days</div>
                        </div>
                      </div>
                      <div className="flex-1" />
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {habit.completedThisWeek}/{habit.targetPerWeek} this week
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((habit.completedThisWeek / habit.targetPerWeek) * 100)}% complete
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {habit.history.map((completed, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 h-12 rounded flex flex-col items-center justify-center text-xs ${
                            completed ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {completed && <Check className="h-4 w-4 mb-1" />}
                          <span>{weekDays[idx]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            <Target className="h-4 w-4 mr-2" />
            Add New Habit
          </Button>
        </div>
      </main>
    </div>
  )
}
