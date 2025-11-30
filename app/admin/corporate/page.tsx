import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Building2, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function CorporateProgramsPage() {
  const supabase = await createClient()

  let programs
  if (!supabase) {
    console.log("[v0] Supabase not configured - using mock data mode")
    // Mock corporate programs data
    programs = [
      {
        id: "1",
        company_name: "Tech Solutions Inc",
        contact_name: "Sarah Johnson",
        contact_email: "sarah.j@techsolutions.com",
        discount_percentage: 20,
        employee_count: 150,
        is_active: true,
        contract_start_date: "2024-01-01",
        contract_end_date: "2024-12-31",
        enrollments: [{ count: 42 }],
      },
      {
        id: "2",
        company_name: "Green Energy Co",
        contact_name: "Mike Chen",
        contact_email: "m.chen@greenenergy.com",
        discount_percentage: 15,
        employee_count: 85,
        is_active: true,
        contract_start_date: "2024-03-01",
        contract_end_date: "2025-02-28",
        enrollments: [{ count: 28 }],
      },
      {
        id: "3",
        company_name: "Creative Design Studio",
        contact_name: "Emma Williams",
        contact_email: "emma@creativedesign.com",
        discount_percentage: 25,
        employee_count: 45,
        is_active: true,
        contract_start_date: "2023-06-01",
        contract_end_date: null,
        enrollments: [{ count: 31 }],
      },
    ]
  } else {
    const { data } = await supabase
      .from("corporate_programs")
      .select(`
        *,
        enrollments:corporate_enrollments(count)
      `)
      .order("created_at", { ascending: false })
    programs = data
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corporate Programs</h1>
          <p className="text-muted-foreground">Manage corporate wellness partnerships</p>
        </div>
        <Button asChild>
          <Link href="/admin/corporate/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Program
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {programs && programs.length > 0 ? (
          programs.map((program: any) => (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{program.company_name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {program.contact_name} • {program.contact_email}
                      </p>
                    </div>
                  </div>
                  <Badge variant={program.is_active ? "default" : "secondary"}>
                    {program.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">Discount</span>
                    <span className="font-medium">{program.discount_percentage}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Employees</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{program.employee_count || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Enrolled</span>
                    <span className="font-medium">{program.enrollments?.[0]?.count || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Contract Period</span>
                    <span className="font-medium">
                      {program.contract_start_date
                        ? `${new Date(program.contract_start_date).toLocaleDateString()} - ${
                            program.contract_end_date
                              ? new Date(program.contract_end_date).toLocaleDateString()
                              : "Ongoing"
                          }`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No corporate programs found</p>
              <Button asChild>
                <Link href="/admin/corporate/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Program
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
