import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Snowflake, ArrowUpCircle, RefreshCw, UserPlus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ManageMembershipPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: memberships } = await supabase
    .from("memberships")
    .select(`
      *,
      membership_type:membership_types(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const activeMembership = memberships?.find((m: any) => m.status === "active")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Membership</h1>
        <p className="text-muted-foreground mb-8">View and manage your membership settings</p>

        {activeMembership ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{activeMembership.membership_type.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{activeMembership.membership_type.description}</p>
                  </div>
                  <Badge variant="default" className="text-sm">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Start Date</span>
                    <span className="font-medium">{new Date(activeMembership.start_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">End Date</span>
                    <span className="font-medium">{new Date(activeMembership.end_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Classes Remaining</span>
                    <span className="font-medium">
                      {activeMembership.classes_remaining !== null ? activeMembership.classes_remaining : "Unlimited"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Auto-Renew</span>
                    <Badge variant={activeMembership.auto_renew ? "default" : "secondary"}>
                      {activeMembership.auto_renew ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                {activeMembership.frozen_at && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Snowflake className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">Membership Frozen</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Frozen until: {new Date(activeMembership.frozen_until).toLocaleDateString()}
                    </p>
                    {activeMembership.freeze_reason && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Reason: {activeMembership.freeze_reason}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/membership/freeze">
                      <Snowflake className="mr-2 h-4 w-4" />
                      {activeMembership.frozen_at ? "Unfreeze" : "Freeze"}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/membership/upgrade">
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      Upgrade
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/membership/auto-renew">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Auto-Renew Settings
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/membership/transfer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Transfer
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memberships?.map((membership: any) => (
                    <div key={membership.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{membership.membership_type.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(membership.start_date).toLocaleDateString()} -{" "}
                          {new Date(membership.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          membership.status === "active"
                            ? "default"
                            : membership.status === "expired"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {membership.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">You don't have an active membership</p>
              <Button asChild>
                <Link href="/memberships">View Membership Plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
