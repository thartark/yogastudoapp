"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, DollarSign } from "lucide-react"

export default function TaxReportsPage() {
  const quarters = [
    {
      id: "q1-2025",
      name: "Q1 2025",
      period: "Jan - Mar 2025",
      revenue: 45000,
      expenses: 22000,
      taxableIncome: 23000,
      estimatedTax: 5750,
      status: "current",
    },
    {
      id: "q4-2024",
      name: "Q4 2024",
      period: "Oct - Dec 2024",
      revenue: 52000,
      expenses: 24000,
      taxableIncome: 28000,
      estimatedTax: 7000,
      status: "filed",
    },
    {
      id: "q3-2024",
      name: "Q3 2024",
      period: "Jul - Sep 2024",
      revenue: 48000,
      expenses: 23000,
      taxableIncome: 25000,
      estimatedTax: 6250,
      status: "filed",
    },
  ]

  const taxCategories = [
    { name: "Revenue from Memberships", amount: 32000, percentage: 65 },
    { name: "Revenue from Workshops", amount: 8500, percentage: 17 },
    { name: "Revenue from Retail", amount: 5000, percentage: 10 },
    { name: "Revenue from Private Sessions", amount: 4000, percentage: 8 },
  ]

  const deductions = [
    { name: "Rent & Utilities", amount: 7500, category: "Operating Expenses" },
    { name: "Instructor Payroll", amount: 11500, category: "Labor" },
    { name: "Marketing & Advertising", amount: 800, category: "Marketing" },
    { name: "Supplies & Equipment", amount: 1200, category: "Materials" },
    { name: "Insurance", amount: 1000, category: "Operating Expenses" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Reports</h1>
          <p className="text-muted-foreground">Generate tax reports and track quarterly filings</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$145,000</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$69,000</div>
            <p className="text-xs text-muted-foreground">Deductible expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxable Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$76,000</div>
            <p className="text-xs text-muted-foreground">Net income YTD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Tax Owed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$19,000</div>
            <p className="text-xs text-muted-foreground">At 25% rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quarterly Reports</CardTitle>
          <CardDescription>Review and download quarterly tax reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quarters.map((quarter) => (
              <div key={quarter.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{quarter.name}</div>
                    <div className="text-sm text-muted-foreground">{quarter.period}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Revenue</div>
                    <div className="font-medium">${quarter.revenue.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Expenses</div>
                    <div className="font-medium">${quarter.expenses.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Est. Tax</div>
                    <div className="font-medium">${quarter.estimatedTax.toLocaleString()}</div>
                  </div>
                  <Badge variant={quarter.status === "filed" ? "secondary" : "default"}>{quarter.status}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Income sources for tax reporting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">{cat.percentage}% of total</div>
                  </div>
                  <div className="font-semibold">${cat.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Deductions</CardTitle>
            <CardDescription>Deductible business expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deductions.map((deduction) => (
                <div key={deduction.name} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{deduction.name}</div>
                    <div className="text-xs text-muted-foreground">{deduction.category}</div>
                  </div>
                  <div className="font-semibold">${deduction.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Download reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Export for QuickBooks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
