import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminNotificationsPage() {
  const supabase = await createClient()

  const { data: templates } = await supabase.from("email_templates").select("*").order("name")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground">Manage automated email templates</p>
        </div>
      </div>

      <div className="grid gap-4">
        {templates && templates.length > 0 ? (
          templates.map((template: any) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">{template.name.replace(/_/g, " ")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Subject:</span>
                    <p className="text-sm text-muted-foreground">{template.subject}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Variables:</span>
                    <p className="text-sm text-muted-foreground">{template.variables?.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No email templates found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
