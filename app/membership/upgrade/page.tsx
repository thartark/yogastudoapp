import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { ArrowUpCircle, Check } from "lucide-react"

export default async function UpgradeMembershipPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: currentMembership } = await supabase
    .from("memberships")
    .select(`
      *,
      membership_type:membership_types(*)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!currentMembership) {
    redirect("/memberships")
  }

  const { data: availableTiers } = await supabase
    .from("membership_types")
    .select("*")
    .eq("is_active", true)
    .gt("price_cents", currentMembership.membership_type.price_cents)
    .order("price_cents")

  async function upgradeMembership(formData: FormData) {
    "use server"
    const supabase = await createClient()

    const newTierId = formData.get("tier_id") as string

    const { data: newTier } = await supabase.from("membership_types").select("*").eq("id", newTierId).single()

    if (!newTier) return

    // Calculate prorated amount
    const daysRemaining = Math.ceil(
      (new Date(currentMembership.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    const proratedAmount = Math.round(
      ((newTier.price_cents - currentMembership.membership_type.price_cents) * daysRemaining) /
        currentMembership.membership_type.validity_days,
    )

    // Record the change
    await supabase.from("membership_changes").insert({
      membership_id: currentMembership.id,
      from_membership_type_id: currentMembership.membership_type_id,
      to_membership_type_id: newTierId,
      change_type: "upgrade",
      prorated_amount_cents: proratedAmount,
      effective_date: new Date().toISOString().split("T")[0],
    })

    // Update membership
    await supabase
      .from("memberships")
      .update({
        membership_type_id: newTierId,
        prorated_amount_cents: proratedAmount,
      })
      .eq("id", currentMembership.id)

    redirect("/membership/manage")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Upgrade Membership</h1>
        <p className="text-muted-foreground mb-8">Choose a higher tier to unlock more benefits</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentMembership.membership_type.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${(currentMembership.membership_type.price_cents / 100).toFixed(2)} /{" "}
                  {currentMembership.membership_type.billing_cycle || "month"}
                </p>
              </div>
              <Badge>Current Plan</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {availableTiers && availableTiers.length > 0 ? (
            availableTiers.map((tier: any) => (
              <Card key={tier.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      {tier.tier_level && (
                        <Badge variant="outline" className="mt-1 capitalize">
                          {tier.tier_level}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${(tier.price_cents / 100).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">/ {tier.billing_cycle || "month"}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {tier.class_count !== null ? `${tier.class_count} classes` : "Unlimited classes"}
                    </li>
                    {tier.multi_studio_access && (
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        Multi-studio access
                      </li>
                    )}
                    {tier.family_plan && (
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        Family plan (up to {tier.max_family_members} members)
                      </li>
                    )}
                  </ul>

                  <form action={upgradeMembership}>
                    <input type="hidden" name="tier_id" value={tier.id} />
                    <Button type="submit" className="w-full">
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      Upgrade to {tier.name}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">You're already on the highest tier available!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
