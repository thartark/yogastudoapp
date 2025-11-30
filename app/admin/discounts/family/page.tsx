"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Percent } from "lucide-react"

export default function FamilyDiscountsPage() {
  const [familyGroups, setFamilyGroups] = useState([
    {
      id: "fam-1",
      familyName: "Smith Family",
      members: ["John Smith", "Jane Smith", "Tommy Smith"],
      discount: 20,
      totalSavings: 348,
      activeSince: "2024-06-01",
    },
    {
      id: "fam-2",
      familyName: "Johnson Family",
      members: ["Bob Johnson", "Mary Johnson"],
      discount: 15,
      totalSavings: 180,
      activeSince: "2024-09-15",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family & Group Discounts</h1>
          <p className="text-muted-foreground">Manage multi-member family and group pricing</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{familyGroups.length}</div>
            <p className="text-xs text-muted-foreground">Family groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{familyGroups.reduce((sum, f) => sum + f.members.length, 0)}</div>
            <p className="text-xs text-muted-foreground">In family plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Discount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(familyGroups.reduce((sum, f) => sum + f.discount, 0) / familyGroups.length).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Average savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${familyGroups.reduce((sum, f) => sum + f.totalSavings, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Family Group</CardTitle>
            <CardDescription>Set up a new family or group discount plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Family/Group Name</Label>
              <Input placeholder="e.g., Smith Family, Corporate Group" />
            </div>

            <div className="space-y-2">
              <Label>Primary Contact</Label>
              <Input placeholder="Search for existing client" />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="tier">Tiered Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Amount</Label>
              <div className="flex gap-2">
                <Input type="number" placeholder="15" />
                <Select>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="%" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">%</SelectItem>
                    <SelectItem value="dollar">$</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Members</Label>
              <Input type="number" placeholder="2" />
            </div>

            <Button className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Create Family Group
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount Tiers</CardTitle>
            <CardDescription>Automatic discounts based on family size</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">2 Members</p>
                  <p className="text-sm text-muted-foreground">Couples discount</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>10% off</Badge>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">3-4 Members</p>
                  <p className="text-sm text-muted-foreground">Family discount</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>15% off</Badge>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">5+ Members</p>
                  <p className="text-sm text-muted-foreground">Group discount</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>20% off</Badge>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              Add New Tier
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Family Groups</CardTitle>
          <CardDescription>All family and group discount accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {familyGroups.map((family) => (
              <div key={family.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{family.familyName}</p>
                      <Badge variant="secondary">
                        <Percent className="h-3 w-3 mr-1" />
                        {family.discount}% off
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{family.members.join(", ")}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{family.members.length} members</span>
                      <span>Total savings: ${family.totalSavings.toFixed(2)}</span>
                      <span>Active since: {new Date(family.activeSince).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Members
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
