"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, TagIcon } from "lucide-react"

const colorOptions = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export default function ClientTagsPage() {
  const [tags, setTags] = useState([
    { id: "1", name: "VIP", color: "#f59e0b", count: 12 },
    { id: "2", name: "New Member", color: "#10b981", count: 24 },
    { id: "3", name: "At Risk", color: "#ef4444", count: 5 },
    { id: "4", name: "Teacher Training", color: "#8b5cf6", count: 8 },
    { id: "5", name: "Prenatal", color: "#ec4899", count: 6 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Tags</h1>
          <p className="text-muted-foreground">Organize and categorize your clients</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Tag</CardTitle>
            <CardDescription>Add custom tags to categorize clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tag Name</Label>
              <Input placeholder="e.g., VIP, New Member, At Risk" />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>

            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Tags</CardTitle>
            <CardDescription>Manage your client categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                  <div>
                    <p className="font-medium">{tag.name}</p>
                    <p className="text-sm text-muted-foreground">{tag.count} clients</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Tag Usage
          </CardTitle>
          <CardDescription>How tags help organize your studio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Marketing</h4>
              <p className="text-sm text-muted-foreground">
                Send targeted emails and promotions to specific client groups
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Retention</h4>
              <p className="text-sm text-muted-foreground">Identify at-risk clients and engage them proactively</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Programs</h4>
              <p className="text-sm text-muted-foreground">Track clients in special programs like teacher training</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
