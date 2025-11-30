"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Gift, DollarSign, Mail } from "lucide-react"

export default function GiftCertificatesPage() {
  const [certificates, setCertificates] = useState([
    {
      id: "gift-1",
      code: "YOGA2025",
      amount: 100,
      recipientEmail: "john@example.com",
      purchaser: "Mary Smith",
      status: "active",
      balance: 100,
      createdAt: "2025-01-15",
    },
    {
      id: "gift-2",
      code: "HOLIDAY50",
      amount: 50,
      recipientEmail: "alex@example.com",
      purchaser: "Jane Doe",
      status: "partial",
      balance: 25,
      createdAt: "2024-12-20",
    },
    {
      id: "gift-3",
      code: "BDAY75",
      amount: 75,
      recipientEmail: "sarah@example.com",
      purchaser: "Bob Johnson",
      status: "redeemed",
      balance: 0,
      createdAt: "2024-11-10",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gift Certificates</h1>
          <p className="text-muted-foreground">Manage gift certificate sales and redemptions</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificates.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Unredeemed certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${certificates.reduce((sum, c) => sum + c.balance, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Month Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$450</div>
            <p className="text-xs text-muted-foreground">Revenue from gift certificates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Gift Certificate</CardTitle>
            <CardDescription>Generate a new gift certificate for purchase or promotion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  $25
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  $50
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  $75
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  $100
                </Button>
              </div>
              <Input type="number" placeholder="Custom amount" />
            </div>

            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input type="email" placeholder="recipient@example.com" />
            </div>

            <div className="space-y-2">
              <Label>Purchaser Name</Label>
              <Input placeholder="Gift giver's name" />
            </div>

            <div className="space-y-2">
              <Label>Personal Message (Optional)</Label>
              <Input placeholder="Happy Birthday! Enjoy your yoga classes." />
            </div>

            <Button className="w-full">
              <Gift className="mr-2 h-4 w-4" />
              Create & Send Certificate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redeem Gift Certificate</CardTitle>
            <CardDescription>Apply a gift certificate to a purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Certificate Code</Label>
              <Input placeholder="Enter gift certificate code" />
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              Check Balance
            </Button>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available Balance:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Purchase Amount:</span>
                <Input type="number" placeholder="0.00" className="w-24 h-8 text-right" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remaining Balance:</span>
                <span className="font-semibold">$0.00</span>
              </div>
            </div>

            <Button className="w-full">
              <DollarSign className="mr-2 h-4 w-4" />
              Apply to Purchase
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Gift Certificates</CardTitle>
          <CardDescription>Track all issued certificates and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono">{cert.code}</p>
                    <Badge
                      variant={
                        cert.status === "active" ? "default" : cert.status === "partial" ? "secondary" : "outline"
                      }
                    >
                      {cert.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To: {cert.recipientEmail} | From: {cert.purchaser}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Issued: {new Date(cert.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold">${cert.balance.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">of ${cert.amount.toFixed(2)}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
