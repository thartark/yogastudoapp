"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cake, Mail, Gift } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"

export default function ClientBirthdaysPage() {
  const { clients } = useMockData()
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([])

  useEffect(() => {
    if (clients) {
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)

      const birthdays = clients
        .filter((client: any) => client.date_of_birth)
        .map((client: any) => {
          const birthDate = new Date(client.date_of_birth)
          const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())

          if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1)
          }

          const daysUntil = Math.floor((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          return {
            ...client,
            upcomingBirthday: thisYearBirthday,
            daysUntil,
          }
        })
        .filter((client: any) => client.daysUntil <= 30)
        .sort((a: any, b: any) => a.daysUntil - b.daysUntil)

      setUpcomingBirthdays(birthdays)
    }
  }, [clients])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Birthdays</h1>
          <p className="text-muted-foreground">Track and celebrate your clients' special days</p>
        </div>
        <Button>
          <Gift className="mr-2 h-4 w-4" />
          Send Birthday Email
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingBirthdays.filter((c) => c.daysUntil <= 7).length}</div>
            <p className="text-xs text-muted-foreground">Birthdays this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingBirthdays.length}</div>
            <p className="text-xs text-muted-foreground">Birthdays this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Auto-Greetings</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Enabled</Badge>
            <p className="text-xs text-muted-foreground mt-2">Automatic emails sent</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5" />
            Upcoming Birthdays
          </CardTitle>
          <CardDescription>Next 30 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingBirthdays.length > 0 ? (
            upcomingBirthdays.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Cake className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{client.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.upcomingBirthday.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                      {client.daysUntil === 0 && " - Today!"}
                      {client.daysUntil === 1 && " - Tomorrow"}
                      {client.daysUntil > 1 && ` - In ${client.daysUntil} days`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Gift className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No upcoming birthdays in the next 30 days</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Birthday Automation Settings</CardTitle>
          <CardDescription>Configure automatic birthday greetings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Send Automatic Birthday Emails</p>
              <p className="text-sm text-muted-foreground">Send personalized emails on clients' birthdays</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Birthday Class Discount</p>
              <p className="text-sm text-muted-foreground">Offer free or discounted class on birthday month</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
