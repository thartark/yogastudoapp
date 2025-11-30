import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your studio settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Studio Information</CardTitle>
          <CardDescription>Update your studio details and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Settings configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
