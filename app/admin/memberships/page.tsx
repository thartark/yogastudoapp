"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminMembershipsPage() {
  const { getMockData } = useMockData()
  const [memberships, setMemberships] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()

    // Combine memberships with client and type info
    const membershipsWithDetails = (data.memberships || []).map((membership: any) => {
      const client = data.clients?.find((c: any) => c.id === membership.user_id)
      const membershipType = data.membershipTypes?.find((t: any) => t.id === membership.membership_type_id)

      return {
        ...membership,
        client_name: client?.full_name || "Unknown",
        client_email: client?.email || "",
        type_name: membershipType?.name || "Unknown",
        type_info: membershipType,
      }
    })

    setMemberships(membershipsWithDetails)
  }, [getMockData])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Memberships</h1>
        <p className="text-muted-foreground">View and manage client memberships</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Memberships ({memberships.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Classes Remaining</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships && memberships.length > 0 ? (
                memberships.map((membership: any) => (
                  <TableRow key={membership.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{membership.client_name}</p>
                        <p className="text-sm text-muted-foreground">{membership.client_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{membership.type_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          membership.status === "active"
                            ? "default"
                            : membership.status === "expired"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {membership.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {membership.classes_remaining !== null && membership.classes_remaining !== undefined
                        ? membership.classes_remaining
                        : "Unlimited"}
                    </TableCell>
                    <TableCell>
                      {membership.end_date ? new Date(membership.end_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No memberships found
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
