import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function InstructorPayrollPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const { data: instructor } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  const { data: payrollRecords } = await supabase
    .from("instructor_payroll")
    .select("*")
    .eq("instructor_id", params.id)
    .order("pay_period_start", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{instructor?.full_name} - Payroll</h1>
        <p className="text-muted-foreground">Manage instructor compensation</p>
      </div>

      <div className="grid gap-4">
        {payrollRecords?.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {new Date(record.pay_period_start).toLocaleDateString()} -{" "}
                    {new Date(record.pay_period_end).toLocaleDateString()}
                  </CardTitle>
                  <CardDescription>
                    {record.total_classes} classes, {record.total_private_sessions} private sessions
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    record.status === "paid" ? "default" : record.status === "approved" ? "secondary" : "outline"
                  }
                >
                  {record.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Pay:</span>
                  <span className="font-medium">${record.base_pay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bonus:</span>
                  <span className="font-medium">${record.bonus_pay}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${record.total_pay}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
