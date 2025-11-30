"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function AdminInstructorsPage() {
  const { getMockData } = useMockData()
  const [instructors, setInstructors] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()
    console.log("[v0] Instructors loaded:", data.instructors?.length || 0)
    setInstructors(data.instructors || [])
  }, []) // Empty dependency array

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
          <p className="text-muted-foreground">Manage your teaching staff</p>
        </div>
        <Button asChild>
          <Link href="/admin/instructors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instructors && instructors.length > 0 ? (
          instructors.map((instructor: any) => (
            <Card key={instructor.id}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {instructor.avatar_url && (
                    <Image
                      src={instructor.avatar_url || "/placeholder.svg"}
                      alt={instructor.full_name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{instructor.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {instructor.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {instructor.phone && (
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {instructor.phone}
                  </p>
                )}

                {instructor.bio && <p className="text-sm text-muted-foreground line-clamp-2">{instructor.bio}</p>}

                {instructor.certifications && instructor.certifications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.certifications.map((cert: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {instructor.specialties && instructor.specialties.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.specialties.map((specialty: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {instructor.hourly_rate && <p className="text-sm font-medium">Rate: ${instructor.hourly_rate}/hour</p>}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No instructors found</p>
              <Button asChild>
                <Link href="/admin/instructors/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Instructor
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
