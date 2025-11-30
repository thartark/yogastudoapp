import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default async function ReportsPage() {
  const supabase = await createServerClient()

  // Get financial data
  const { data: memberships } = await supabase.from("memberships").select("price, created_at")

  const { data: expenses } = await supabase.from("expenses").select("amount, category, expense_date")

  const totalRevenue = memberships?.reduce((sum, m) => sum + Number(m.price), 0) || 0
  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Revenue</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-semibold">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-4">Expenses</h3>
            <div className="space-y-2">
              {Object.entries(
                expenses?.reduce(
                  (acc, expense) => {
                    const category = expense.category
                    acc[category] = (acc[category] || 0) + Number(expense.amount)
                    return acc
                  },
                  {} as Record<string, number>,
                ) || {},
              ).map(([category, amount]) => (
                <div key={category} className="flex justify-between">
                  <span className="capitalize">{category}</span>
                  <span className="font-semibold">${amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total Expenses</span>
                <span className="font-semibold">${totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-bold">Net Profit</span>
                <span className={`font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${netProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Profit Margin</span>
                <span className="font-semibold">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tax Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate tax reports for deductible expenses and revenue
            </p>
            <Button className="w-full">Generate Tax Report</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Year-End Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Comprehensive financial summary for the fiscal year</p>
            <Button className="w-full">Generate Year-End Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
