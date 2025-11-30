import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function TeacherTrainingPage() {
  const supabase = await createServerClient()

  let programs: any[] = []

  if (!supabase) {
    // Mock data for teacher training programs
    programs = [
      {
        id: "tt-1",
        name: "200-Hour Yoga Teacher Training",
        certification_level: "RYT-200",
        description: "Comprehensive foundational training for aspiring yoga teachers",
        total_hours: 200,
        start_date: "2025-04-01",
        end_date: "2025-06-30",
        price: 2995,
        max_students: 20,
        profiles: { full_name: "Sarah Johnson" },
      },
      {
        id: "tt-2",
        name: "300-Hour Advanced Training",
        certification_level: "RYT-500",
        description: "Advanced training for experienced teachers seeking RYT-500",
        total_hours: 300,
        start_date: "2025-09-01",
        end_date: "2025-12-15",
        price: 3495,
        max_students: 15,
        profiles: { full_name: "David Kim" },
      },
    ]
  } else {
    const { data } = await supabase
      .from("teacher_training_programs")
      .select(`
        *,
        profiles!teacher_training_programs_lead_instructor_id_fkey(full_name)
      `)
      .order("start_date", { ascending: true })

    programs = data || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teacher Training Programs</h1>
          <p className="text-muted-foreground">Manage yoga teacher certification programs</p>
        </div>
        <Button asChild>
          <Link href="/admin/teacher-training/new">Create Program</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {programs?.map((program: any) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{program.name}</CardTitle>
                  <CardDescription>Led by {program.profiles?.full_name || "TBD"}</CardDescription>
                </div>
                <Badge>{program.certification_level}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{program.total_hours} hours</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dates</p>
                  <p className="font-medium">
                    {new Date(program.start_date).toLocaleDateString()} -{" "}
                    {new Date(program.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Investment</p>
                  <p className="font-medium">${program.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max Students</p>
                  <p className="font-medium">{program.max_students}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/teacher-training/${program.id}`}>Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
