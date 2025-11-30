import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Percent, DollarSign } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function DiscountCodesPage() {
  const supabase = await createClient()

  let discounts
  if (!supabase) {
    console.log("[v0] Supabase not configured - using mock data mode")
    // Mock discount codes data
    discounts = [
      {
        id: "1",
        code: "WELCOME25",
        description: "New member welcome discount",
        discount_type: "percentage",
        discount_value: 25,
        current_uses: 45,
        max_uses: 100,
        valid_until: "2024-12-31",
        is_active: true,
        applicable_to: ["monthly", "annual"],
      },
      {
        id: "2",
        code: "SUMMER50",
        description: "Summer special offer",
        discount_type: "percentage",
        discount_value: 50,
        current_uses: 23,
        max_uses: 50,
        valid_until: "2024-08-31",
        is_active: true,
        applicable_to: ["annual"],
      },
      {
        id: "3",
        code: "FRIEND20",
        description: "Referral discount",
        discount_type: "percentage",
        discount_value: 20,
        current_uses: 67,
        max_uses: null,
        valid_until: null,
        is_active: true,
        applicable_to: ["monthly", "annual", "class-pack"],
      },
    ]
  } else {
    const { data } = await supabase
      .from("membership_discount_codes")
      .select("*")
      .order("created_at", { ascending: false })
    discounts = data
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discount Codes</h1>
          <p className="text-muted-foreground">Manage membership discount codes and promotions</p>
        </div>
        <Button asChild>
          <Link href="/admin/memberships/discounts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Code
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {discounts && discounts.length > 0 ? (
          discounts.map((discount: any) => (
            <Card key={discount.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-mono">{discount.code}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{discount.description}</p>
                  </div>
                  <Badge variant={discount.is_active ? "default" : "secondary"}>
                    {discount.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Discount</span>
                    <div className="flex items-center gap-1 font-medium">
                      {discount.discount_type === "percentage" ? (
                        <>
                          <Percent className="h-4 w-4" />
                          {discount.discount_value}%
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          {(discount.discount_value / 100).toFixed(2)}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Usage</span>
                    <span className="font-medium">
                      {discount.current_uses} / {discount.max_uses || "∞"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Valid Until</span>
                    <span className="font-medium">
                      {discount.valid_until ? new Date(discount.valid_until).toLocaleDateString() : "No expiry"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Applicable To</span>
                    <div className="flex flex-wrap gap-1">
                      {discount.applicable_to?.map((type: string) => (
                        <Badge key={type} variant="outline" className="text-xs capitalize">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No discount codes found</p>
              <Button asChild>
                <Link href="/admin/memberships/discounts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Code
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
