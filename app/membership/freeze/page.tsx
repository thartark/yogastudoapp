import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { redirect } from "next/navigation"
import { Snowflake } from "lucide-react"

export default async function FreezeMembershipPage() {
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

  async function freezeMembership(formData: FormData) {
    "use server"
    const supabase = await createClient()

    const freezeUntil = formData.get("freeze_until") as string
    const reason = formData.get("reason") as string

    const { error } = await supabase
      .from("memberships")
      .update({
        frozen_at: new Date().toISOString(),
        frozen_until: freezeUntil,
        freeze_reason: reason,
      })
      .eq("id", membership.id)

    if (!error) {
      await supabase.from("membership_freeze_history").insert({
        membership_id: membership.id,
        frozen_at: new Date().toISOString(),
        freeze_reason: reason,
        frozen_by_user_id: user.id,
      })
    }

    redirect("/membership/manage")
  }

  async function unfreezeMembership() {
    "use server"
    const supabase = await createClient()

    const { error } = await supabase
      .from("memberships")
      .update({
        frozen_at: null,
        frozen_until: null,
        freeze_reason: null,
      })
      .eq("id", membership.id)

    if (!error) {
      await supabase
        .from("membership_freeze_history")
        .update({ unfrozen_at: new Date().toISOString() })
        .eq("membership_id", membership.id)
        .is("unfrozen_at", null)
    }

    redirect("/membership/manage")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {membership.frozen_at ? "Unfreeze" : "Freeze"} Membership
        </h1>
        <p className="text-muted-foreground mb-8">
          {membership.frozen_at
            ? "Resume your membership and start booking classes again"
            : "Temporarily pause your membership"}
        </p>

        {membership.frozen_at ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Snowflake className="h-5 w-5 text-blue-600" />
                Membership Currently Frozen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Frozen Since</span>
                  <span className="font-medium">{new Date(membership.frozen_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Frozen Until</span>
                  <span className="font-medium">{new Date(membership.frozen_until).toLocaleDateString()}</span>
                </div>
                {membership.freeze_reason && (
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Reason</span>
                    <p className="text-sm">{membership.freeze_reason}</p>
                  </div>
                )}
              </div>

              <form action={unfreezeMembership}>
                <Button type="submit" className="w-full">
                  Unfreeze Membership
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Freeze Your Membership</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={freezeMembership} className="space-y-4">
                <div>
                  <Label htmlFor="freeze_until">Freeze Until</Label>
                  <Input
                    id="freeze_until"
                    name="freeze_until"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Your membership end date will be extended by the freeze period
                  </p>
                </div>

                <div>
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Let us know why you're freezing your membership..."
                    rows={3}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> While your membership is frozen, you won't be able to book classes. Your
                    membership end date will be automatically extended by the freeze period.
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Freeze Membership
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
