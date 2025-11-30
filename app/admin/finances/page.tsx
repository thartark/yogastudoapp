import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react"
import Link from "next/link"
import { getMockData } from "@/lib/mock-data"

export default async function FinancesPage() {
  const supabase = await createServerClient()

  if (!supabase) {
    const mockData = getMockData()

    const totalMembershipRevenue = mockData.memberships.reduce((sum, m) => sum + m.price, 0)
    const totalWorkshopRevenue = mockData.workshops.reduce((sum, w) => sum + w.price * (w.registered_count || 0), 0)
    const totalProductRevenue = mockData.products.reduce((sum, p) => sum + p.price * 10, 0) // Assume 10 sold per product
    const totalRevenue = totalMembershipRevenue + totalWorkshopRevenue + totalProductRevenue

    const totalExpenses = 15000 // Mock expense data
    const netProfit = totalRevenue - totalExpenses

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Financial Management</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450.00</div>
              <p className="text-xs text-muted-foreground">To instructors</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Track revenue by category and analyze profitability</p>
              <Link href="/admin/finances/revenue">
                <Button className="w-full">View Revenue</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Track and categorize business expenses</p>
              <Link href="/admin/finances/expenses">
                <Button className="w-full">Manage Expenses</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructor Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Calculate commissions and process payouts</p>
              <Link href="/admin/finances/payouts">
                <Button className="w-full">Manage Payouts</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Generate P&L statements and tax reports</p>
              <Link href="/admin/finances/reports">
                <Button className="w-full">View Reports</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage installment plans and payment schedules</p>
              <Link href="/admin/finances/payment-plans">
                <Button className="w-full">View Plans</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Set budgets and track spending by category</p>
              <Link href="/admin/finances/budgets">
                <Button className="w-full">Manage Budgets</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get revenue data
  const { data: memberships } = await supabase.from("memberships").select("price").eq("status", "active")

  const { data: workshops } = await supabase.from("workshop_registrations").select("amount_paid")

  const { data: products } = await supabase.from("orders").select("total_amount").eq("status", "completed")

  const { data: expenses } = await supabase.from("expenses").select("amount")

  const totalRevenue =
    (memberships?.reduce((sum, m) => sum + Number(m.price), 0) || 0) +
    (workshops?.reduce((sum, w) => sum + Number(w.amount_paid), 0) || 0) +
    (products?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0)

  const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450.00</div>
            <p className="text-xs text-muted-foreground">To instructors</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Track revenue by category and analyze profitability</p>
            <Link href="/admin/finances/revenue">
              <Button className="w-full">View Revenue</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Track and categorize business expenses</p>
            <Link href="/admin/finances/expenses">
              <Button className="w-full">Manage Expenses</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructor Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Calculate commissions and process payouts</p>
            <Link href="/admin/finances/payouts">
              <Button className="w-full">Manage Payouts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Generate P&L statements and tax reports</p>
            <Link href="/admin/finances/reports">
              <Button className="w-full">View Reports</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Manage installment plans and payment schedules</p>
            <Link href="/admin/finances/payment-plans">
              <Button className="w-full">View Plans</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Set budgets and track spending by category</p>
            <Link href="/admin/finances/budgets">
              <Button className="w-full">Manage Budgets</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
