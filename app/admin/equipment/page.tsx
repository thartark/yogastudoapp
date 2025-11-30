import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EquipmentPage() {
  const supabase = await createServerClient()

  const { data: equipment } = await supabase.from("equipment").select("*").order("category")

  const groupedEquipment = equipment?.reduce((acc: any, item: any) => {
    const category = item.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment Inventory</h1>
          <p className="text-muted-foreground">Track and manage studio equipment</p>
        </div>
        <Button asChild>
          <Link href="/admin/equipment/new">Add Equipment</Link>
        </Button>
      </div>

      {Object.entries(groupedEquipment || {}).map(([category, items]: [string, any]) => (
        <div key={category}>
          <h2 className="text-xl font-semibold mb-4 capitalize">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item: any) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>Quantity: {item.quantity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Condition:</span>
                      <Badge
                        variant={
                          item.condition === "excellent"
                            ? "default"
                            : item.condition === "good"
                              ? "secondary"
                              : item.condition === "fair"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {item.condition}
                      </Badge>
                    </div>
                    {item.last_maintenance_date && (
                      <p className="text-xs text-muted-foreground">
                        Last maintained: {new Date(item.last_maintenance_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
