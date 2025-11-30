"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { detectUserTimezone } from "@/lib/timezone-utils"
import { Globe } from "lucide-react"

const commonTimezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Australia/Sydney",
]

export function TimezoneSelector() {
  const [timezone, setTimezone] = useState<string>("")

  useEffect(() => {
    const detectedTz = detectUserTimezone()
    setTimezone(detectedTz)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={timezone} onValueChange={setTimezone}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          {commonTimezones.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {tz.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
