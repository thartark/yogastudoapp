"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Share2 } from "lucide-react"

export default function ReferralProgramPage() {
  const [referrals, setReferrals] = useState([
    {
      id: "1",
      referrer: "John Doe",
      referred: "Alice Smith",
      status: "converted",
      reward: 25,
      date: "2025-01-15",
    },
    {
      id: "2",
      referrer: "Mary Johnson",
      referred: "Bob Williams",
      status: "pending",
      reward: 0,
      date: "2025-01-20",
    },
    {
      id: "3",
      referrer: "John Doe",
      referred: "Carol Brown",
      status: "converted",
      reward: 25,
      date: "2025-01-22",
    },
  ])

  const topReferrers = [
    { name: "John Doe", referrals: 8, rewards: 200 },
    { name: "Sarah Johnson", referrals: 5, rewards: 125 },
    { name: "Michael Chen", referrals: 4, rewards: 100 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
          <p className="text-muted-foreground">Grow your studio through word-of-mouth marketing</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referrals.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {((referrals.filter((r) => r.status === "converted").length / referrals.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Referred to members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rewards Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${referrals.reduce((sum, r) => sum + r.reward, 0)}</div>
            <p className="text-xs text-muted-foreground">In credits given</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">New Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$3,725</div>
            <p className="text-xs text-muted-foreground">From referrals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Referral Program Settings</CardTitle>
            <CardDescription>Configure your referral rewards and incentives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reward Type</Label>
              <Select defaultValue="credit">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Account Credit</SelectItem>
                  <SelectItem value="discount">Discount Code</SelectItem>
                  <SelectItem value="freeclass">Free Class Pass</SelectItem>
                  <SelectItem value="both">Credit for Both Parties</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reward Amount (Referrer)</Label>
              <div className="flex gap-2">
                <Input type="number" placeholder="25" defaultValue="25" />
                <Select defaultValue="dollar">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dollar">$</SelectItem>
                    <SelectItem value="percent">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Member Incentive</Label>
              <div className="flex gap-2">
                <Input type="number" placeholder="15" defaultValue="15" />
                <Select defaultValue="dollar">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dollar">$</SelectItem>
                    <SelectItem value="percent">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requirements</Label>
              <Select defaultValue="purchase">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signup">Reward on sign-up</SelectItem>
                  <SelectItem value="purchase">Reward on first purchase</SelectItem>
                  <SelectItem value="attendance">Reward after first class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Members bringing in the most new clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{referrer.name}</p>
                    <p className="text-sm text-muted-foreground">{referrer.referrals} successful referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${referrer.rewards}</p>
                  <p className="text-xs text-muted-foreground">earned</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Share Referral Links</CardTitle>
          <CardDescription>Help members share your studio with friends</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Referral Link Template</Label>
            <div className="flex gap-2">
              <Input value="https://pranaplanner.com/join?ref=USERNAME" readOnly />
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg text-center">
              <p className="font-medium mb-2">Email Template</p>
              <p className="text-sm text-muted-foreground mb-3">Pre-written email members can send</p>
              <Button variant="outline" size="sm">
                View Template
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="font-medium mb-2">Social Media Posts</p>
              <p className="text-sm text-muted-foreground mb-3">Ready-to-share graphics</p>
              <Button variant="outline" size="sm">
                Download Assets
              </Button>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="font-medium mb-2">QR Code</p>
              <p className="text-sm text-muted-foreground mb-3">Printable referral code</p>
              <Button variant="outline" size="sm">
                Generate QR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Referrals</CardTitle>
          <CardDescription>Track referral status and rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{referral.referrer}</p>
                    <span className="text-muted-foreground">→</span>
                    <p className="text-muted-foreground">{referral.referred}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(referral.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {referral.reward > 0 && (
                    <Badge variant="secondary">
                      <Gift className="h-3 w-3 mr-1" />${referral.reward}
                    </Badge>
                  )}
                  <Badge variant={referral.status === "converted" ? "default" : "outline"}>{referral.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
