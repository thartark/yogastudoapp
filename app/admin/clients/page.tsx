"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

export default function AdminClientsPage() {
  const { getMockData } = useMockData()
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()
    console.log("[v0] Mock data loaded:", data)
    console.log("[v0] Clients count:", data.clients?.length || 0)

    // Combine clients with their membership info
    const clientsWithMemberships = (data.clients || []).map((client: any) => {
      const activeMembership = data.memberships?.find((m: any) => m.user_id === client.id && m.status === "active")

      let membershipInfo = null
      if (activeMembership) {
        const membershipType = data.membershipTypes?.find((t: any) => t.id === activeMembership.membership_type_id)
        membershipInfo = {
          name: membershipType?.name || "Unknown",
          end_date: activeMembership.end_date,
          classes_remaining: activeMembership.classes_remaining,
        }
      }

      return {
        ...client,
        membership: membershipInfo,
      }
    })

    console.log("[v0] Setting clients:", clientsWithMemberships.length)
    setClients(clientsWithMemberships)
  }, []) // Empty dependency array to run once on mount

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Manage your studio members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients && clients.length > 0 ? (
                clients.map((client: any) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.full_name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {client.email}
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.membership ? (
                        <div>
                          <Badge variant="secondary">{client.membership.name}</Badge>
                          {client.membership.classes_remaining !== null && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {client.membership.classes_remaining} classes left
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline">No active membership</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.joined_date ? new Date(client.joined_date).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No clients found
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
