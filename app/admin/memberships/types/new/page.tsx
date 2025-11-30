import { CreateMembershipTypeForm } from "@/components/create-membership-type-form"

export default function NewMembershipTypePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Membership Plan</h1>
        <p className="text-muted-foreground">Add a new membership or class pack option</p>
      </div>

      <CreateMembershipTypeForm />
    </div>
  )
}
