export function detectUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function formatTimeInTimezone(
  date: Date | string,
  timezone: string,
  format: "full" | "time" | "date" = "full",
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    ...(format === "full" && {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...(format === "time" && {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...(format === "date" && {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }

  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}

export function convertToLocalTime(utcDate: string | Date): Date {
  return new Date(utcDate)
}
