import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function DiscountCodesPage() {
  const supabase = await createServerClient()

  const { data: codes } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discount Codes</h1>
          <p className="text-muted-foreground">Manage promotional codes and discounts</p>
        </div>
        <Button asChild>
          <Link href="/admin/discount-codes/new">Create Code</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {codes?.map((code) => (
          <Card key={code.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-mono">{code.code}</CardTitle>
                  <CardDescription>{code.description}</CardDescription>
                </div>
                <Badge variant={code.is_active ? "default" : "secondary"}>
                  {code.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="font-medium">
                    {code.discount_type === "percentage" ? `${code.discount_value}%` : `$${code.discount_value}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uses:</span>
                  <span className="font-medium">
                    {code.uses_count} / {code.max_uses || "∞"}
                  </span>
                </div>
                {code.valid_until && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="font-medium">{new Date(code.valid_until).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
