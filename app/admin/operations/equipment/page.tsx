"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, AlertTriangle, CheckCircle } from "lucide-react"

export default function EquipmentManagementPage() {
  const [equipment, setEquipment] = useState([
    {
      id: "1",
      name: "Yoga Mats",
      category: "Mats",
      quantity: 45,
      minQuantity: 30,
      status: "good",
      lastChecked: "2025-01-20",
    },
    {
      id: "2",
      name: "Yoga Blocks (Cork)",
      category: "Props",
      quantity: 38,
      minQuantity: 40,
      status: "low",
      lastChecked: "2025-01-22",
    },
    {
      id: "3",
      name: "Yoga Straps",
      category: "Props",
      quantity: 32,
      minQuantity: 25,
      status: "good",
      lastChecked: "2025-01-18",
    },
    {
      id: "4",
      name: "Bolsters",
      category: "Props",
      quantity: 18,
      minQuantity: 15,
      status: "good",
      lastChecked: "2025-01-19",
    },
    {
      id: "5",
      name: "Blankets",
      category: "Props",
      quantity: 8,
      minQuantity: 20,
      status: "critical",
      lastChecked: "2025-01-15",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Management</h1>
          <p className="text-muted-foreground">Track and manage studio equipment inventory</p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{equipment.length}</div>
            <p className="text-xs text-muted-foreground">Equipment types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{equipment.filter((e) => e.status === "good").length}</div>
            <p className="text-xs text-muted-foreground">Adequate inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{equipment.filter((e) => e.status === "low").length}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{equipment.filter((e) => e.status === "critical").length}</div>
            <p className="text-xs text-muted-foreground">Urgent attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
            <CardDescription>Register new equipment in inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Equipment Name</Label>
              <Input placeholder="e.g., Yoga Mats, Blocks, Straps" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mats">Mats</SelectItem>
                    <SelectItem value="props">Props</SelectItem>
                    <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio-a">Studio A</SelectItem>
                    <SelectItem value="studio-b">Studio B</SelectItem>
                    <SelectItem value="storage">Storage Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Min Quantity Alert</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>

            <Button className="w-full">Add to Inventory</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Checkout</CardTitle>
            <CardDescription>Track borrowed equipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Equipment Item</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.quantity} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Borrower</Label>
              <Input placeholder="Client name or ID" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>

            <Button className="w-full">Check Out Equipment</Button>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Currently Checked Out</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 border rounded">
                  <span>2x Blocks - John Doe</span>
                  <Button variant="ghost" size="sm">
                    Return
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Inventory</CardTitle>
          <CardDescription>All equipment with stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  {item.status === "critical" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                  {item.status === "low" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  {item.status === "good" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.name}</p>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(item.lastChecked).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold">{item.quantity}</p>
                  <p className="text-xs text-muted-foreground">Min: {item.minQuantity}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Adjust
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>Track equipment maintenance and cleaning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deep Clean All Mats</p>
                <p className="text-sm text-muted-foreground">Due: Weekly on Sundays</p>
              </div>
              <Button variant="outline" size="sm">
                Mark Complete
              </Button>
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Inspect Blocks for Damage</p>
                <p className="text-sm text-muted-foreground">Due: Monthly</p>
              </div>
              <Button variant="outline" size="sm">
                Mark Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
