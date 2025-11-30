"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Copy, Plus, Trash2, Save } from "lucide-react"

export default function ScheduleTemplatesPage() {
  const [templates] = useState([
    {
      id: "template-1",
      name: "Regular Week Schedule",
      description: "Standard weekly schedule with morning and evening classes",
      classCount: 42,
      lastUsed: "2025-01-20",
    },
    {
      id: "template-2",
      name: "Summer Intensive",
      description: "High-volume summer schedule with extended hours",
      classCount: 68,
      lastUsed: "2024-07-15",
    },
    {
      id: "template-3",
      name: "Holiday Schedule",
      description: "Reduced schedule for holiday periods",
      classCount: 28,
      lastUsed: "2024-12-24",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Templates</h1>
          <p className="text-muted-foreground">Create and manage reusable schedule templates</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create From Current Schedule</CardTitle>
          <CardDescription>Save your current schedule as a reusable template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" placeholder="e.g., Spring 2025 Schedule" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-desc">Description</Label>
                <Input id="template-desc" placeholder="Brief description of this template" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Classes</span>
                  <Badge>{template.classCount} classes/week</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Used</span>
                  <span>{new Date(template.lastUsed).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
