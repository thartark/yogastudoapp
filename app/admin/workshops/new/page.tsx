import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CreateWorkshopForm } from "@/components/create-workshop-form"

export default async function NewWorkshopPage() {
  const supabase = await createClient()

  const { data: instructors } = await supabase
    .from("instructors")
    .select(
      `
      id,
      profiles!instructors_user_id_fkey(full_name)
    `,
    )
    .eq("is_active", true)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Workshop</h1>
          <p className="text-muted-foreground">Add a new workshop or special event</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/workshops">Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workshop Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateWorkshopForm instructors={instructors || []} />
        </CardContent>
      </Card>
    </div>
  )
}
