import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function RevenuePage() {
  const supabase = await createServerClient()

  // Get revenue by category
  const { data: memberships } = await supabase
    .from("memberships")
    .select("price, created_at, membership_type:membership_types(name)")

  const { data: workshops } = await supabase
    .from("workshop_registrations")
    .select("amount_paid, created_at, workshop:workshops(title)")

  const { data: orders } = await supabase.from("orders").select("total_amount, created_at").eq("status", "completed")

  const { data: privateSessions } = await supabase.from("private_session_bookings").select("amount_paid, created_at")

  const membershipRevenue = memberships?.reduce((sum, m) => sum + Number(m.price), 0) || 0
  const workshopRevenue = workshops?.reduce((sum, w) => sum + Number(w.amount_paid), 0) || 0
  const retailRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  const privateSessionRevenue = privateSessions?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

  const totalRevenue = membershipRevenue + workshopRevenue + retailRevenue + privateSessionRevenue

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Revenue Tracking</h1>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memberships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${membershipRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{memberships?.length || 0} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workshops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${workshopRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{workshops?.length || 0} registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Retail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${retailRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{orders?.length || 0} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Private Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${privateSessionRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{privateSessions?.length || 0} sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="memberships">
        <TabsList>
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="retail">Retail</TabsTrigger>
          <TabsTrigger value="private">Private Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="memberships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membership Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberships?.map((membership) => (
                  <div key={membership.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{membership.membership_type?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(membership.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold">${Number(membership.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workshops?.map((workshop) => (
                  <div key={workshop.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{workshop.workshop?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workshop.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold">${Number(workshop.amount_paid).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Retail Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="font-semibold">${Number(order.total_amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="private" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Private Session Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privateSessions?.map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Private Session</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold">${Number(session.amount_paid).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
