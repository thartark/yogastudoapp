import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

export default async function PaymentPlansPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: paymentPlans } = await supabase
    .from("payment_plans")
    .select("*, installments:installment_payments(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Payment Plans</h1>

      {paymentPlans && paymentPlans.length > 0 ? (
        <div className="grid gap-4">
          {paymentPlans.map((plan) => {
            const paidInstallments = plan.installments?.filter((i) => i.status === "paid").length || 0
            const totalInstallments = plan.installments?.length || 0
            const progress = (paidInstallments / totalInstallments) * 100

            return (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">{plan.item_type} Payment Plan</CardTitle>
                    <Badge
                      variant={
                        plan.status === "active" ? "default" : plan.status === "completed" ? "secondary" : "destructive"
                      }
                    >
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-semibold">${Number(plan.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Down Payment</span>
                      <span className="font-semibold">${Number(plan.down_payment).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Installment Amount</span>
                      <span className="font-semibold">${Number(plan.installment_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="font-semibold capitalize">{plan.frequency}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {paidInstallments} / {totalInstallments} paid
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Upcoming Payments</h4>
                    {plan.installments
                      ?.filter((i) => i.status === "pending")
                      .slice(0, 3)
                      .map((installment) => (
                        <div key={installment.id} className="flex justify-between text-sm">
                          <span>Payment #{installment.installment_number}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Due {new Date(installment.due_date).toLocaleDateString()}
                            </span>
                            <span className="font-semibold">${Number(installment.amount).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">You don't have any active payment plans.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
