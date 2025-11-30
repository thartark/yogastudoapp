import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { redirect } from "next/navigation"
import { UserPlus } from "lucide-react"

export default async function TransferMembershipPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select(`
      *,
      membership_type:membership_types(*)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!membership) {
    redirect("/membership/manage")
  }

  async function transferMembership(formData: FormData) {
    "use server"
    const supabase = await createClient()

    const recipientEmail = formData.get("recipient_email") as string
    const reason = formData.get("reason") as string

    // Find recipient user
    const { data: recipient } = await supabase.from("profiles").select("id").eq("email", recipientEmail).single()

    if (!recipient) {
      // In a real app, you'd handle this error properly
      redirect("/membership/transfer?error=user_not_found")
      return
    }

    // Record the transfer
    await supabase.from("membership_changes").insert({
      membership_id: membership.id,
      from_membership_type_id: membership.membership_type_id,
      to_membership_type_id: membership.membership_type_id,
      change_type: "transfer",
      reason: reason,
      effective_date: new Date().toISOString().split("T")[0],
    })

    // Transfer the membership
    await supabase
      .from("memberships")
      .update({
        user_id: recipient.id,
        transferred_from_user_id: user.id,
        transferred_at: new Date().toISOString(),
      })
      .eq("id", membership.id)

    redirect("/memberships")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Transfer Membership</h1>
        <p className="text-muted-foreground mb-8">Transfer your membership to another person</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={transferMembership} className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2 mb-6">
                <p className="text-sm font-medium">Current Membership</p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{membership.membership_type.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Classes Remaining:</span>
                    <span className="font-medium">
                      {membership.classes_remaining !== null ? membership.classes_remaining : "Unlimited"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span className="font-medium">{new Date(membership.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="recipient_email">Recipient Email</Label>
                <Input
                  id="recipient_email"
                  name="recipient_email"
                  type="email"
                  placeholder="recipient@example.com"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">The recipient must have an existing account</p>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Transfer (Optional)</Label>
                <Textarea id="reason" name="reason" placeholder="Why are you transferring this membership?" rows={3} />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  <strong>Warning:</strong> This action cannot be undone. Once transferred, you will lose access to this
                  membership and all its benefits. The recipient will receive full access immediately.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Transfer Membership
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
