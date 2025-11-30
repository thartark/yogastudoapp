import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CreateScheduleForm } from "@/components/create-schedule-form"

export default async function NewSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: classData } = await supabase.from("classes").select("*").eq("id", id).single()

  if (!classData) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Schedule - {classData.name}</h1>
        <p className="text-muted-foreground">Create a recurring schedule for this class</p>
      </div>

      <CreateScheduleForm classId={id} />
    </div>
  )
}
