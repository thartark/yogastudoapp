"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, AlertTriangle, Plus } from "lucide-react"

export default function BudgetsPage() {
  const budgets = [
    {
      category: "Rent",
      budgeted: 5000,
      spent: 5000,
      remaining: 0,
      percentage: 100,
    },
    {
      category: "Utilities",
      budgeted: 500,
      spent: 350,
      remaining: 150,
      percentage: 70,
    },
    {
      category: "Marketing",
      budgeted: 800,
      spent: 650,
      remaining: 150,
      percentage: 81,
    },
    {
      category: "Supplies",
      budgeted: 600,
      spent: 450,
      remaining: 150,
      percentage: 75,
    },
    {
      category: "Maintenance",
      budgeted: 1000,
      spent: 850,
      remaining: 150,
      percentage: 85,
    },
    {
      category: "Payroll",
      budgeted: 12000,
      spent: 11500,
      remaining: 500,
      percentage: 96,
    },
  ]

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budget Planning</h1>
          <p className="text-muted-foreground">Set and track spending budgets by category</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{Math.round((totalSpent / totalBudgeted) * 100)}% of budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRemaining.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Available to spend</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{budget.category}</div>
                    <div className="text-sm text-muted-foreground">
                      ${budget.spent.toFixed(2)} of ${budget.budgeted.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        budget.percentage >= 95 ? "destructive" : budget.percentage >= 80 ? "secondary" : "outline"
                      }
                    >
                      {budget.percentage}%
                    </Badge>
                    <span className="text-sm font-medium">${budget.remaining.toFixed(2)} left</span>
                  </div>
                </div>
                <Progress
                  value={budget.percentage}
                  className={
                    budget.percentage >= 95
                      ? "[&>div]:bg-destructive"
                      : budget.percentage >= 80
                        ? "[&>div]:bg-yellow-500"
                        : ""
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Based on current spending patterns, here's your projected budget status for next month:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Projected Total Spending</div>
                <div className="text-2xl font-bold">${(totalSpent * 1.05).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">+5% from this month</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Recommended Budget</div>
                <div className="text-2xl font-bold">${(totalBudgeted * 1.1).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">+10% buffer for growth</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
