"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, MapPin, User, Grid3x3 } from "lucide-react"
import Link from "next/link"

export default function BookClassPage({ params }: { params: { id: string } }) {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null)
  const [inviteFriends, setInviteFriends] = useState(false)
  const [friendEmails, setFriendEmails] = useState([""])

  // Mock studio layout - 5 rows x 4 columns
  const rows = 5
  const cols = 4
  const spots = Array.from({ length: rows * cols }, (_, i) => i + 1)
  const takenSpots = [2, 7, 8, 12, 15]

  const addFriendField = () => {
    setFriendEmails([...friendEmails, ""])
  }

  const updateFriendEmail = (index: number, value: string) => {
    const updated = [...friendEmails]
    updated[index] = value
    setFriendEmails(updated)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/classes/${params.id}`} className="text-sm text-muted-foreground hover:underline">
            ← Back to class details
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Book Your Class</h1>
          <p className="text-muted-foreground">Morning Vinyasa Flow with Sarah Chen</p>
          <p className="text-sm text-muted-foreground">Monday, Jan 20 at 9:00 AM • 60 minutes</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Choose Your Spot
              </CardTitle>
              <CardDescription>Select your preferred mat location in the studio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 border-2 border-primary rounded" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-muted rounded" />
                      <span>Taken</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-primary rounded" />
                      <span>Selected</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="text-center text-sm font-medium mb-4 pb-2 border-b">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Front of Room
                  </div>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {spots.map((spot) => {
                      const isTaken = takenSpots.includes(spot)
                      const isSelected = selectedSpot === spot
                      return (
                        <button
                          key={spot}
                          disabled={isTaken}
                          onClick={() => setSelectedSpot(spot)}
                          className={`
                            aspect-square rounded border-2 flex items-center justify-center text-sm font-medium
                            transition-colors
                            ${isTaken ? "bg-muted border-muted cursor-not-allowed" : ""}
                            ${isSelected ? "bg-primary text-primary-foreground border-primary" : ""}
                            ${!isTaken && !isSelected ? "border-primary hover:bg-primary/10" : ""}
                          `}
                        >
                          {spot}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {selectedSpot && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-medium">
                      {selectedSpot}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-green-900">Spot {selectedSpot} selected</p>
                      <p className="text-green-700">Your mat will be reserved at this location</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Invite Friends
                </CardTitle>
                <CardDescription>Practice together! Invite friends to join this class</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="invite-friends"
                    checked={inviteFriends}
                    onCheckedChange={(checked) => setInviteFriends(checked as boolean)}
                  />
                  <label
                    htmlFor="invite-friends"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I want to invite friends to this class
                  </label>
                </div>

                {inviteFriends && (
                  <div className="space-y-3">
                    {friendEmails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="email"
                            placeholder="friend@example.com"
                            value={email}
                            onChange={(e) => updateFriendEmail(index, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addFriendField}>
                      <User className="h-4 w-4 mr-2" />
                      Add Another Friend
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your friends will receive an email invitation with booking details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Class</span>
                    <span className="font-medium">Morning Vinyasa Flow</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time</span>
                    <span className="font-medium">Jan 20, 9:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instructor</span>
                    <span className="font-medium">Sarah Chen</span>
                  </div>
                  {selectedSpot && (
                    <div className="flex justify-between">
                      <span>Mat Position</span>
                      <Badge>Spot {selectedSpot}</Badge>
                    </div>
                  )}
                  {inviteFriends && friendEmails.filter((e) => e).length > 0 && (
                    <div className="flex justify-between">
                      <span>Friends Invited</span>
                      <Badge>{friendEmails.filter((e) => e).length}</Badge>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Cost</span>
                    <span>1 Class Credit</span>
                  </div>
                  <p className="text-xs text-muted-foreground">12 class credits remaining after booking</p>
                </div>

                <Button className="w-full" size="lg">
                  Confirm Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
