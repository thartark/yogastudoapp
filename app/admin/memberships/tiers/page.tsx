import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getMockData } from "@/lib/mock-data"

export default async function MembershipTiersPage() {
  const supabase = await createClient()

  let tiers
  if (!supabase) {
    console.log("[v0] Supabase not configured - using mock data mode")
    const mockData = getMockData()
    tiers = mockData.membershipTypes || []
  } else {
    const { data } = await supabase.from("membership_types").select("*").order("price_cents")
    tiers = data
  }

  const tierColors: Record<string, string> = {
    basic: "bg-gray-500",
    bronze: "bg-amber-700",
    silver: "bg-gray-400",
    gold: "bg-yellow-500",
    platinum: "bg-purple-600",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Tiers</h1>
          <p className="text-muted-foreground">Manage membership levels and pricing</p>
        </div>
        <Button asChild>
          <Link href="/admin/memberships/types/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tier
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiers && tiers.length > 0 ? (
          tiers.map((tier: any) => (
            <Card key={tier.id} className="relative overflow-hidden">
              {tier.tier_level && (
                <div className={`absolute top-0 left-0 right-0 h-1 ${tierColors[tier.tier_level] || "bg-primary"}`} />
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    {tier.tier_level && (
                      <Badge variant="outline" className="mt-1 capitalize">
                        {tier.tier_level}
                      </Badge>
                    )}
                  </div>
                  <Badge variant={tier.is_active ? "default" : "secondary"}>
                    {tier.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${(tier.price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing:</span>
                    <span className="font-medium capitalize">{tier.billing_cycle || "monthly"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classes:</span>
                    <span className="font-medium">{tier.class_count !== null ? tier.class_count : "Unlimited"}</span>
                  </div>
                  {tier.trial_period_days > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trial:</span>
                      <span className="font-medium">{tier.trial_period_days} days</span>
                    </div>
                  )}
                  {tier.multi_studio_access && (
                    <Badge variant="secondary" className="mt-2">
                      Multi-Studio Access
                    </Badge>
                  )}
                  {tier.family_plan && (
                    <Badge variant="secondary" className="mt-2">
                      Family Plan
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No membership tiers found</p>
              <Button asChild>
                <Link href="/admin/memberships/types/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Tier
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
