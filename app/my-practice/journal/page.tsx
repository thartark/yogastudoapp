"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Calendar, Heart, Smile, Meh, Frown } from "lucide-react"

export default function JournalPage() {
  const [entries] = useState([
    {
      id: "entry-1",
      date: "2025-01-28",
      className: "Vinyasa Flow",
      instructor: "Sarah Johnson",
      mood: "great",
      energy: 8,
      notes:
        "Really enjoyed the flow today. Felt strong in my warrior poses and finally held crow pose for 10 breaths!",
      highlights: ["Crow pose progress", "Strong warrior series"],
    },
    {
      id: "entry-2",
      date: "2025-01-26",
      className: "Yin Yoga",
      instructor: "Michael Chen",
      mood: "calm",
      energy: 6,
      notes: "Needed this restorative practice. The long holds really helped release tension in my hips.",
      highlights: ["Hip opening", "Deep relaxation"],
    },
    {
      id: "entry-3",
      date: "2025-01-24",
      className: "Power Yoga",
      instructor: "Emma Rodriguez",
      mood: "challenged",
      energy: 7,
      notes: "Tough class but pushed through. Struggled with some of the arm balances but that's okay.",
      highlights: ["Mental strength", "Endurance building"],
    },
  ])

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great":
        return <Smile className="h-5 w-5 text-green-500" />
      case "calm":
        return <Heart className="h-5 w-5 text-blue-500" />
      case "challenged":
        return <Meh className="h-5 w-5 text-yellow-500" />
      default:
        return <Frown className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">My Practice Journal</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="class">Class Attended</Label>
                    <Input id="class" placeholder="e.g., Vinyasa Flow" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>How did you feel?</Label>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Smile className="h-4 w-4 mr-2" />
                      Great
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Heart className="h-4 w-4 mr-2" />
                      Calm
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Meh className="h-4 w-4 mr-2" />
                      Challenged
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Frown className="h-4 w-4 mr-2" />
                      Tired
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="energy">Energy Level (1-10)</Label>
                  <Input id="energy" type="range" min="1" max="10" defaultValue="7" className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Practice Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Reflect on your practice today... What felt good? What challenged you? Any breakthroughs or insights?"
                    rows={6}
                  />
                </div>

                <Button className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Past Entries</h2>
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold">{entry.className}</h3>
                        <p className="text-sm text-muted-foreground">{entry.instructor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getMoodIcon(entry.mood)}
                        <Badge variant="secondary">Energy: {entry.energy}/10</Badge>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{entry.notes}</p>

                    {entry.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="outline">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}
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
