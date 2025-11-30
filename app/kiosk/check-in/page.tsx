"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Search, UserCheck, Clock } from "lucide-react"

export default function CheckInKioskPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [recentCheckIns, setRecentCheckIns] = useState([
    { name: "John Doe", time: "2 minutes ago", class: "Vinyasa Flow - 9:00 AM" },
    { name: "Mary Smith", time: "5 minutes ago", class: "Vinyasa Flow - 9:00 AM" },
    { name: "Alex Wong", time: "8 minutes ago", class: "Vinyasa Flow - 9:00 AM" },
  ])

  const upcomingClasses = [
    { name: "Vinyasa Flow", time: "9:00 AM", instructor: "Sarah Johnson", booked: 15, capacity: 20 },
    { name: "Yin Yoga", time: "10:30 AM", instructor: "Michael Chen", booked: 8, capacity: 15 },
    { name: "Power Yoga", time: "12:00 PM", instructor: "Emma Rodriguez", booked: 22, capacity: 25 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">Welcome to Prana Planner</h1>
          <p className="text-xl text-muted-foreground">Check in for your class</p>
        </div>

        <Card className="border-2">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Type your name, email, or phone number..."
                  className="pl-12 h-16 text-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              {searchTerm && (
                <div className="border rounded-lg divide-y">
                  <Button variant="ghost" className="w-full h-20 justify-start text-left">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">John Doe</p>
                      <p className="text-sm text-muted-foreground">Vinyasa Flow - 9:00 AM with Sarah Johnson</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </Button>
                  <Button variant="ghost" className="w-full h-20 justify-start text-left">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">John Smith</p>
                      <p className="text-sm text-muted-foreground">Hot Yoga - 5:00 PM with Emma Rodriguez</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Recent Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCheckIns.map((checkIn, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{checkIn.name}</p>
                    <p className="text-sm text-muted-foreground">{checkIn.class}</p>
                  </div>
                  <Badge variant="secondary">{checkIn.time}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{classItem.name}</p>
                    <Badge>{classItem.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{classItem.instructor}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {classItem.booked}/{classItem.capacity} spots filled
                    </span>
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(classItem.booked / classItem.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Ask a staff member at the front desk</p>
        </div>
      </div>
    </div>
  )
}
