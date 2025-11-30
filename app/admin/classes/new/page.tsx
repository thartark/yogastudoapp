import { CreateClassForm } from "@/components/create-class-form"

export default function NewClassPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
        <p className="text-muted-foreground">Add a new class to your studio offerings</p>
      </div>

      <CreateClassForm />
    </div>
  )
}
