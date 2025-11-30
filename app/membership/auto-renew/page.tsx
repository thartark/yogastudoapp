import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { redirect } from "next/navigation"
import { RefreshCw } from "lucide-react"

export default async function AutoRenewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select(`
      *,
      membership_type:membership_types(*)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!membership) {
    redirect("/membership/manage")
  }

  async function toggleAutoRenew(formData: FormData) {
    "use server"
    const supabase = await createClient()

    const autoRenew = formData.get("auto_renew") === "on"

    await supabase.from("memberships").update({ auto_renew: autoRenew }).eq("id", membership.id)

    redirect("/membership/manage")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Auto-Renew Settings</h1>
        <p className="text-muted-foreground mb-8">Manage automatic renewal for your membership</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Automatic Renewal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={toggleAutoRenew} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="auto_renew" className="text-base">
                    Enable Auto-Renew
                  </Label>
                  <p className="text-sm text-muted-foreground">Automatically renew your membership when it expires</p>
                </div>
                <Switch id="auto_renew" name="auto_renew" defaultChecked={membership.auto_renew} />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Current Membership Details</p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{membership.membership_type.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${(membership.membership_type.price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{new Date(membership.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> If auto-renew is enabled, your membership will automatically renew on{" "}
                  {new Date(membership.end_date).toLocaleDateString()} and you'll be charged $
                  {(membership.membership_type.price_cents / 100).toFixed(2)}. You can cancel auto-renew at any time
                  before the renewal date.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
