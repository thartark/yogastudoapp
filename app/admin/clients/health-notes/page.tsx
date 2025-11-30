"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertCircle, Heart, FileText } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"

export default function HealthNotesPage() {
  const { clients } = useMockData()
  const [searchTerm, setSearchTerm] = useState("")

  const clientsWithHealthNotes = clients?.filter((client: any) => client.medical_notes || client.injuries) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Notes & Waivers</h1>
          <p className="text-muted-foreground">Track client health information and injury notes</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Health Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clientsWithHealthNotes.length}</div>
            <p className="text-xs text-muted-foreground">Clients with health notes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Waivers Signed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients?.filter((c: any) => c.waiver_signed_date).length || 0}</div>
            <p className="text-xs text-muted-foreground">Total signed waivers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Waivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clients?.filter((c: any) => !c.waiver_signed_date).length || 0}</div>
            <p className="text-xs text-muted-foreground">Clients without waivers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Health Notes</CardTitle>
          <CardDescription>Find clients by name or health condition</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by client name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Clients with Health Notes
          </CardTitle>
          <CardDescription>Review medical conditions and injuries before classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {clientsWithHealthNotes.length > 0 ? (
            clientsWithHealthNotes.map((client: any) => (
              <div key={client.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{client.full_name}</p>
                    {!client.waiver_signed_date && <Badge variant="destructive">No Waiver</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  {client.medical_notes && (
                    <div className="flex items-start gap-2 p-2 bg-muted rounded">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{client.medical_notes}</p>
                    </div>
                  )}
                  {client.injuries && (
                    <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-destructive">{client.injuries}</p>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  View Profile
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No clients with health notes</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Waiver Management
          </CardTitle>
          <CardDescription>Track liability waiver signatures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Digital Waiver Template</p>
              <p className="text-sm text-muted-foreground">Clients sign electronically during registration</p>
            </div>
            <Button variant="outline">Edit Template</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Send Waiver Reminders</p>
              <p className="text-sm text-muted-foreground">Email clients who haven't signed</p>
            </div>
            <Button variant="outline">Send Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
