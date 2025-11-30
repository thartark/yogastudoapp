"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, Download, Eye, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function AdminWaiversPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const waivers = [
    {
      id: 1,
      clientName: "Emma Johnson",
      email: "emma.j@email.com",
      signedDate: "2024-01-15",
      status: "signed",
      expiresDate: "2025-01-15",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      email: "michael.c@email.com",
      signedDate: "2024-01-10",
      status: "signed",
      expiresDate: "2025-01-10",
    },
    {
      id: 3,
      clientName: "Sophie Williams",
      email: "sophie.w@email.com",
      signedDate: "2023-12-01",
      status: "expiring",
      expiresDate: "2024-12-01",
    },
    {
      id: 4,
      clientName: "James Miller",
      email: "james.m@email.com",
      signedDate: null,
      status: "pending",
      expiresDate: null,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "signed":
        return <Badge className="bg-green-500">Signed</Badge>
      case "expiring":
        return <Badge className="bg-orange-500">Expiring Soon</Badge>
      case "pending":
        return <Badge variant="destructive">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const signedWaivers = waivers.filter((w) => w.status === "signed")
  const expiringWaivers = waivers.filter((w) => w.status === "expiring")
  const pendingWaivers = waivers.filter((w) => w.status === "pending")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Waiver Management</h1>
          <p className="text-muted-foreground">Track and manage client liability waivers</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Active Waivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signedWaivers.length}</div>
            <p className="text-xs text-muted-foreground">Currently valid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringWaivers.length}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingWaivers.length}</div>
            <p className="text-xs text-muted-foreground">Not yet signed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waivers.length}</div>
            <p className="text-xs text-muted-foreground">All records</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Waivers</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {waivers.map((waiver) => (
                  <Card key={waiver.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{waiver.clientName}</h4>
                            {getStatusBadge(waiver.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{waiver.email}</p>
                          {waiver.signedDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Signed: {waiver.signedDate} • Expires: {waiver.expiresDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {waiver.status === "pending" ? (
                          <Button size="sm">Send Reminder</Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">Waivers Expiring Soon</CardTitle>
              <CardDescription className="text-orange-700">These waivers will expire within 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringWaivers.map((waiver) => (
                  <Card key={waiver.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{waiver.clientName}</h4>
                        <p className="text-sm text-muted-foreground">Expires: {waiver.expiresDate}</p>
                      </div>
                      <Button size="sm">Send Renewal</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Pending Waivers</CardTitle>
              <CardDescription className="text-red-700">
                These clients have not yet signed their waivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingWaivers.map((waiver) => (
                  <Card key={waiver.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{waiver.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{waiver.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Send Waiver</Button>
                        <Button size="sm" variant="outline">
                          Restrict Access
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
