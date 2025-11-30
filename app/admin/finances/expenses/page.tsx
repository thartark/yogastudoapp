import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function ExpensesPage() {
  const supabase = await createServerClient()

  if (!supabase) {
    const mockExpenses = [
      {
        id: "exp-1",
        expense_date: "2025-01-27",
        category: "rent",
        description: "Monthly studio rent",
        vendor: "Downtown Property Management",
        amount: 5000,
        tax_deductible: true,
      },
      {
        id: "exp-2",
        expense_date: "2025-01-25",
        category: "utilities",
        description: "Electricity and water",
        vendor: "PG&E",
        amount: 350,
        tax_deductible: true,
      },
      {
        id: "exp-3",
        expense_date: "2025-01-24",
        category: "supplies",
        description: "Yoga mats and props",
        vendor: "Yoga Props Co.",
        amount: 450,
        tax_deductible: true,
      },
      {
        id: "exp-4",
        expense_date: "2025-01-22",
        category: "marketing",
        description: "Social media advertising",
        vendor: "Instagram Ads",
        amount: 200,
        tax_deductible: true,
      },
    ]

    const categoryTotals = mockExpenses.reduce(
      (acc, expense) => {
        const category = expense.category
        acc[category] = (acc[category] || 0) + Number(expense.amount)
        return acc
      },
      {} as Record<string, number>,
    )

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Expense Management</h1>
          <Link href="/admin/finances/expenses/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(categoryTotals || {}).map(([category, total]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${total.toFixed(2)}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <p className="font-medium">{expense.description || expense.category}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(expense.expense_date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{expense.category}</span>
                      {expense.vendor && (
                        <>
                          <span>•</span>
                          <span>{expense.vendor}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {expense.tax_deductible && <Badge variant="secondary">Tax Deductible</Badge>}
                    <span className="text-lg font-semibold">${Number(expense.amount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*, location:locations(name)")
    .order("expense_date", { ascending: false })
    .limit(50)

  const categoryTotals = expenses?.reduce(
    (acc, expense) => {
      const category = expense.category
      acc[category] = (acc[category] || 0) + Number(expense.amount)
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expense Management</h1>
        <Link href="/admin/finances/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(categoryTotals || {}).map(([category, total]) => (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${total.toFixed(2)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses?.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <p className="font-medium">{expense.description || expense.category}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(expense.expense_date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{expense.category}</span>
                    {expense.vendor && (
                      <>
                        <span>•</span>
                        <span>{expense.vendor}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {expense.tax_deductible && <Badge variant="secondary">Tax Deductible</Badge>}
                  <span className="text-lg font-semibold">${Number(expense.amount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
