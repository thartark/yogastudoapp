"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Link2, CheckCircle, XCircle, Settings, ExternalLink } from "lucide-react"

export default function IntegrationsPage() {
  const integrations = [
    {
      id: "zoom",
      name: "Zoom",
      category: "Video Conferencing",
      description: "Host virtual classes and meetings with automatic meeting links",
      status: "connected",
      lastSync: "2025-01-28 10:30 AM",
      features: ["Auto-generate meeting links", "Recording management", "Participant tracking"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "spotify",
      name: "Spotify",
      category: "Music & Audio",
      description: "Connect your Spotify account to manage class playlists",
      status: "connected",
      lastSync: "2025-01-27 3:45 PM",
      features: ["Playlist management", "Sync favorites", "Share class music"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      category: "Email Marketing",
      description: "Sync contacts and automate email campaigns",
      status: "disconnected",
      lastSync: null,
      features: ["Contact sync", "Campaign automation", "Analytics tracking"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      category: "Accounting",
      description: "Automatically sync revenue, expenses, and invoices",
      status: "connected",
      lastSync: "2025-01-28 12:00 AM",
      features: ["Revenue tracking", "Expense sync", "Tax reporting"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      category: "Calendar & Scheduling",
      description: "Sync class schedules with Google Calendar",
      status: "connected",
      lastSync: "2025-01-28 11:15 AM",
      features: ["Two-way sync", "Automatic updates", "Calendar sharing"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "apple-health",
      name: "Apple Health",
      category: "Health & Fitness",
      description: "Allow students to sync their practice data with Apple Health",
      status: "disconnected",
      lastSync: null,
      features: ["Activity tracking", "Health metrics", "Workout sync"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "stripe",
      name: "Stripe",
      category: "Payments",
      description: "Process payments and manage subscriptions",
      status: "connected",
      lastSync: "2025-01-28 9:30 AM",
      features: ["Payment processing", "Subscription management", "Refund handling"],
      logo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "mindbody",
      name: "Mindbody",
      category: "Studio Management",
      description: "Migrate or sync data with Mindbody",
      status: "disconnected",
      lastSync: null,
      features: ["Data import", "Schedule sync", "Client migration"],
      logo: "/placeholder.svg?height=100&width=100",
    },
  ]

  const categories = Array.from(new Set(integrations.map((i) => i.category)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite tools and automate workflows</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter((i) => i.status === "connected").length}</div>
            <p className="text-xs text-muted-foreground">Currently connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">Total integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Connected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.filter((i) => i.status === "disconnected").length}</div>
            <p className="text-xs text-muted-foreground">Ready to connect</p>
          </CardContent>
        </Card>
      </div>

      {categories.map((category) => {
        const categoryIntegrations = integrations.filter((i) => i.category === category)
        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          <img
                            src={integration.logo || "/placeholder.svg"}
                            alt={integration.name}
                            className="h-8 w-8"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <CardDescription className="text-xs">{integration.category}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={integration.status === "connected" ? "secondary" : "outline"}>
                        {integration.status === "connected" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </>
                        ) : (
                          "Not Connected"
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                    <div className="space-y-2 mb-4">
                      {integration.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {integration.status === "connected" && integration.lastSync && (
                      <div className="text-xs text-muted-foreground mb-4">Last synced: {integration.lastSync}</div>
                    )}

                    <div className="flex gap-2">
                      {integration.status === "connected" ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="flex-1">
                          <Link2 className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>Configure how integrations work with your studio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-sync</div>
                <div className="text-sm text-muted-foreground">Automatically sync data with connected services</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email notifications</div>
                <div className="text-sm text-muted-foreground">Receive emails when sync issues occur</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-way sync</div>
                <div className="text-sm text-muted-foreground">Allow external services to update your data</div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
