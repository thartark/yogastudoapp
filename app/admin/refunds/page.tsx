"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, AlertCircle } from "lucide-react"

export default function RefundsPage() {
  const [refunds, setRefunds] = useState([
    {
      id: "ref-1",
      clientName: "John Doe",
      purchaseType: "Membership",
      amount: 149,
      reason: "Moving out of state",
      status: "pending",
      requestedAt: "2025-01-25",
    },
    {
      id: "ref-2",
      clientName: "Mary Smith",
      purchaseType: "Workshop",
      amount: 75,
      reason: "Schedule conflict",
      status: "approved",
      requestedAt: "2025-01-20",
      processedAt: "2025-01-21",
    },
    {
      id: "ref-3",
      clientName: "Alex Wong",
      purchaseType: "Class Pack",
      amount: 110,
      reason: "Medical reasons",
      status: "completed",
      requestedAt: "2025-01-15",
      processedAt: "2025-01-16",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Refund Management</h1>
          <p className="text-muted-foreground">Process refund requests and track payment returns</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{refunds.filter((r) => r.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{refunds.filter((r) => r.status === "approved").length}</div>
            <p className="text-xs text-muted-foreground">Ready to process</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{refunds.filter((r) => r.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Funds returned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${refunds.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total refunded</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process New Refund</CardTitle>
          <CardDescription>Manually initiate a refund for a client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Client</Label>
              <Input placeholder="Search client name or email" />
            </div>
            <div className="space-y-2">
              <Label>Purchase Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="class-pack">Class Pack</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="private-session">Private Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Refund Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Refund Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original Payment Method</SelectItem>
                  <SelectItem value="store-credit">Store Credit</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason for Refund</Label>
            <Textarea placeholder="Document the reason for this refund..." />
          </div>

          <Button className="w-full">
            <DollarSign className="mr-2 h-4 w-4" />
            Process Refund
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
          <CardDescription>Review and process client refund requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {refunds.map((refund) => (
              <div key={refund.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{refund.clientName}</p>
                      <Badge
                        variant={
                          refund.status === "pending"
                            ? "destructive"
                            : refund.status === "approved"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {refund.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {refund.purchaseType} - ${refund.amount.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Reason:</span> {refund.reason}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {new Date(refund.requestedAt).toLocaleDateString()}
                      {refund.processedAt && ` | Processed: ${new Date(refund.processedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  {refund.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="outline">
                        Deny
                      </Button>
                    </div>
                  )}
                  {refund.status === "approved" && <Button size="sm">Complete Refund</Button>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Refund Policy
          </CardTitle>
          <CardDescription>Current studio refund policy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <strong>Memberships:</strong> Full refund within 7 days of purchase, prorated after that
          </p>
          <p className="text-sm">
            <strong>Class Packs:</strong> Refund for unused classes minus $10 processing fee
          </p>
          <p className="text-sm">
            <strong>Workshops:</strong> Full refund 48+ hours before, 50% within 48 hours, none day-of
          </p>
          <Button variant="outline" className="mt-4 bg-transparent">
            Edit Refund Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
