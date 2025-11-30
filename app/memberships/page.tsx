import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Award, Crown } from "lucide-react"
import { PurchaseMembershipButton } from "@/components/purchase-membership-button"
import { mockDataManager } from "@/lib/mock-data"

export default async function MembershipsPage() {
  const supabase = await createClient()

  let membershipTypes: any[] = []
  let user: any = null
  let activeMemberships: any[] = []

  if (!supabase) {
    const mockTypes = mockDataManager.getMembershipTypes()
    membershipTypes = mockTypes.map((type) => ({
      id: type.id,
      name: type.name,
      description: type.description,
      type: type.type,
      price_cents: type.price * 100,
      validity_days: type.duration_days,
      class_count: type.class_count,
      tier: type.tier,
      is_active: true,
    }))

    user = mockDataManager.getCurrentUser()
    const mockMemberships = mockDataManager.getMemberships(user.id)
    activeMemberships = mockMemberships
      .filter((m) => m.status === "active")
      .filter((m) => !m.end_date || new Date(m.end_date) >= new Date())
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    const { data } = await supabase.from("membership_types").select("*").eq("is_active", true).order("price_cents")

    membershipTypes = data || []

    if (user) {
      const { data: membershipsData } = await supabase
        .from("memberships")
        .select("membership_type_id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gte("end_date", new Date().toISOString().split("T")[0])

      activeMemberships = membershipsData || []
    }
  }

  const tierConfig: Record<string, { icon: any; color: string; badge: string }> = {
    bronze: { icon: Award, color: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    silver: { icon: Star, color: "text-slate-500", badge: "bg-slate-100 text-slate-700" },
    gold: { icon: Zap, color: "text-yellow-500", badge: "bg-yellow-100 text-yellow-700" },
    platinum: { icon: Crown, color: "text-purple-500", badge: "bg-purple-100 text-purple-700" },
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Prana Planner
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/classes">Browse Classes</Link>
            </Button>
            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/dashboard">My Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Membership</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your yoga journey. All memberships include access to our full class schedule.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto mb-12">
          {membershipTypes && membershipTypes.length > 0 ? (
            membershipTypes.map((membership: any) => {
              const isActive = activeMemberships.some((m) => m.membership_type_id === membership.id)
              const isUnlimited = membership.type === "unlimited"
              const priceDisplay = (membership.price_cents / 100).toFixed(2)
              const tier = membership.tier || "bronze"
              const TierIcon = tierConfig[tier]?.icon || Award
              const isPopular = tier === "gold" || tier === "platinum"

              return (
                <Card
                  key={membership.id}
                  className={`flex flex-col relative ${isActive ? "border-primary shadow-lg" : ""} ${
                    isPopular ? "border-primary/50 shadow-md" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className={tierConfig[tier]?.badge}>Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TierIcon className={`h-5 w-5 ${tierConfig[tier]?.color}`} />
                        <CardTitle className="text-xl">{membership.name}</CardTitle>
                      </div>
                      {isActive && <Badge variant="default">Active</Badge>}
                    </div>
                    <CardDescription className="text-sm min-h-[40px]">{membership.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-bold">${priceDisplay}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Valid for {membership.validity_days} days
                        {membership.validity_days >= 365 && " - Best Value!"}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">
                          {isUnlimited ? "Unlimited classes" : `${membership.class_count} classes`}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">All class types included</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">Book up to 7 days in advance</span>
                      </div>
                      {isUnlimited && (
                        <>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">Priority booking</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">Free guest passes</span>
                          </div>
                        </>
                      )}
                      {tier === "platinum" && (
                        <div className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">10% off retail & workshops</span>
                        </div>
                      )}
                    </div>

                    {user ? (
                      <PurchaseMembershipButton membershipTypeId={membership.id} userId={user.id} disabled={isActive} />
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/auth/login">Sign in to purchase</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No membership plans available at the moment</p>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Compare Plans</CardTitle>
              <CardDescription>Find the perfect membership for your practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      {membershipTypes.slice(0, 4).map((type) => (
                        <th key={type.id} className="text-center py-3 px-4">
                          {type.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Classes per month</td>
                      {membershipTypes.slice(0, 4).map((type) => (
                        <td key={type.id} className="text-center py-3 px-4">
                          {type.type === "unlimited" ? "Unlimited" : type.class_count}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Validity period</td>
                      {membershipTypes.slice(0, 4).map((type) => (
                        <td key={type.id} className="text-center py-3 px-4">
                          {type.validity_days} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Priority booking</td>
                      {membershipTypes.slice(0, 4).map((type) => (
                        <td key={type.id} className="text-center py-3 px-4">
                          {type.type === "unlimited" ? <Check className="h-5 w-5 text-primary mx-auto" /> : "-"}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Guest passes</td>
                      {membershipTypes.slice(0, 4).map((type) => (
                        <td key={type.id} className="text-center py-3 px-4">
                          {type.type === "unlimited" ? <Check className="h-5 w-5 text-primary mx-auto" /> : "-"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Retail & workshop discount</td>
                      {membershipTypes.slice(0, 4).map((type) => (
                        <td key={type.id} className="text-center py-3 px-4">
                          {type.tier === "platinum" ? "10%" : "-"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my membership?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel anytime. Your membership will remain active until the end of your current billing
                  period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens to unused classes?</h3>
                <p className="text-sm text-muted-foreground">
                  Class packs are valid for the specified number of days. Unused classes expire after this period.
                  Unlimited memberships reset each billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I upgrade my membership?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Contact us and we'll help you upgrade to a plan that better suits your needs. We'll prorate the
                  difference.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I freeze my membership?</h3>
                <p className="text-sm text-muted-foreground">
                  Unlimited memberships can be frozen for up to 30 days per year. Class packs automatically pause when
                  not in use.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you offer family or couple memberships?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Contact us for special pricing on family and couple memberships. Save up to 20% when you practice
                  together.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Prana Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
