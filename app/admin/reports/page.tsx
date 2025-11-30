import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ReportsPage() {
  const supabase = await createClient()

  // Get attendance stats for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: attendanceData } = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      class_instances!bookings_class_instance_id_fkey(
        scheduled_date,
        classes!class_instances_class_id_fkey(name)
      )
    `,
    )
    .gte("class_instances.scheduled_date", thirtyDaysAgo.toISOString().split("T")[0])
    .lte("class_instances.scheduled_date", new Date().toISOString().split("T")[0])

  // Calculate stats
  const totalBookings = attendanceData?.length || 0
  const attended = attendanceData?.filter((b) => b.status === "attended").length || 0
  const noShows = attendanceData?.filter((b) => b.status === "no-show").length || 0
  const cancelled = attendanceData?.filter((b) => b.status === "cancelled").length || 0

  // Get popular classes
  const classStats = attendanceData?.reduce(
    (acc: any, booking: any) => {
      const className = booking.class_instances?.classes?.name || "Unknown"
      if (!acc[className]) {
        acc[className] = { total: 0, attended: 0 }
      }
      acc[className].total++
      if (booking.status === "attended") {
        acc[className].attended++
      }
      return acc
    },
    {} as Record<string, { total: number; attended: number }>,
  )

  const popularClasses = Object.entries(classStats || {})
    .map(([name, stats]: [string, any]) => ({
      name,
      bookings: stats.total,
      attendance: stats.attended,
      rate: ((stats.attended / stats.total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View attendance and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attended}</div>
            <p className="text-xs text-muted-foreground">
              {totalBookings > 0 ? ((attended / totalBookings) * 100).toFixed(1) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">No Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noShows}</div>
            <p className="text-xs text-muted-foreground">
              {totalBookings > 0 ? ((noShows / totalBookings) * 100).toFixed(1) : 0}% no-show rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelled}</div>
            <p className="text-xs text-muted-foreground">
              {totalBookings > 0 ? ((cancelled / totalBookings) * 100).toFixed(1) : 0}% cancellation rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead className="text-right">Total Bookings</TableHead>
                <TableHead className="text-right">Attended</TableHead>
                <TableHead className="text-right">Attendance Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularClasses.length > 0 ? (
                popularClasses.map((classItem, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell className="text-right">{classItem.bookings}</TableCell>
                    <TableCell className="text-right">{classItem.attendance}</TableCell>
                    <TableCell className="text-right">{classItem.rate}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
