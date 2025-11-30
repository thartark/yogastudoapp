"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ClientBookings } from "@/components/client-bookings"

export function CheckInSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [client, setClient] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError(null)
    setClient(null)

    const supabase = createClient()

    try {
      // Search by email or name
      const { data, error: searchError } = await supabase
        .from("profiles")
        .select("*")
        .or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .eq("role", "client")
        .limit(1)
        .single()

      if (searchError || !data) {
        setError("Client not found")
        return
      }

      setClient(data)
    } catch (err: any) {
      setError("Error searching for client")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <Button type="submit" disabled={isSearching}>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {client && <ClientBookings client={client} />}
    </div>
  )
}
