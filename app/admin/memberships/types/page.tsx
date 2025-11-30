import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function MembershipTypesPage() {
  const supabase = await createClient()

  const { data: membershipTypes } = await supabase.from("membership_types").select("*").order("price_cents")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
          <p className="text-muted-foreground">Manage your membership offerings</p>
        </div>
        <Button asChild>
          <Link href="/admin/memberships/types/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {membershipTypes && membershipTypes.length > 0 ? (
          membershipTypes.map((membership: any) => (
            <Card key={membership.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{membership.name}</CardTitle>
                  <Badge variant={membership.is_active ? "default" : "secondary"}>
                    {membership.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{membership.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium capitalize">{membership.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${(membership.price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classes:</span>
                    <span className="font-medium">
                      {membership.class_count !== null ? membership.class_count : "Unlimited"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validity:</span>
                    <span className="font-medium">{membership.validity_days} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No membership plans found</p>
              <Button asChild>
                <Link href="/admin/memberships/types/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Plan
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
