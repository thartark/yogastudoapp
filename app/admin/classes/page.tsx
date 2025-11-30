"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"

export default function AdminClassesPage() {
  const { getMockData } = useMockData()
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()
    console.log("[v0] Classes loaded:", data.classes?.length || 0)
    setClasses(data.classes || [])
  }, []) // Empty dependency array

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage your class offerings and schedules</p>
        </div>
        <Button asChild>
          <Link href="/admin/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {classes && classes.length > 0 ? (
          classes.map((classItem: any) => (
            <Card key={classItem.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{classItem.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{classItem.instructor_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default">Active</Badge>
                    <Badge variant="outline">{classItem.difficulty_level}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{classItem.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">Duration:</span> {classItem.duration} minutes
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span> {classItem.capacity} students
                  </div>
                  <div>
                    <span className="font-medium">Style:</span> {classItem.style}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> ${classItem.price}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Manage Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    View Instances
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No classes found</p>
              <Button asChild>
                <Link href="/admin/classes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Class
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
