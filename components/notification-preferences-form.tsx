"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function NotificationPreferencesForm({ preferences }: { preferences: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email_booking_confirmation: preferences?.email_booking_confirmation ?? true,
    email_booking_reminder: preferences?.email_booking_reminder ?? true,
    email_booking_cancelled: preferences?.email_booking_cancelled ?? true,
    email_waitlist_notification: preferences?.email_waitlist_notification ?? true,
    email_membership_expiring: preferences?.email_membership_expiring ?? true,
    email_workshop_updates: preferences?.email_workshop_updates ?? true,
    email_order_updates: preferences?.email_order_updates ?? true,
    email_marketing: preferences?.email_marketing ?? true,
    sms_booking_reminder: preferences?.sms_booking_reminder ?? false,
    sms_class_cancelled: preferences?.sms_class_cancelled ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("notification_preferences").update(formData).eq("id", preferences.id)

      if (error) throw error

      alert("Preferences updated successfully!")
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Email Notifications</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_booking_confirmation" className="flex-1">
            Booking confirmations
          </Label>
          <Switch
            id="email_booking_confirmation"
            checked={formData.email_booking_confirmation}
            onCheckedChange={(checked) => setFormData({ ...formData, email_booking_confirmation: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_booking_reminder" className="flex-1">
            Class reminders (24 hours before)
          </Label>
          <Switch
            id="email_booking_reminder"
            checked={formData.email_booking_reminder}
            onCheckedChange={(checked) => setFormData({ ...formData, email_booking_reminder: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_booking_cancelled" className="flex-1">
            Booking cancellations
          </Label>
          <Switch
            id="email_booking_cancelled"
            checked={formData.email_booking_cancelled}
            onCheckedChange={(checked) => setFormData({ ...formData, email_booking_cancelled: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_waitlist_notification" className="flex-1">
            Waitlist spot available
          </Label>
          <Switch
            id="email_waitlist_notification"
            checked={formData.email_waitlist_notification}
            onCheckedChange={(checked) => setFormData({ ...formData, email_waitlist_notification: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_membership_expiring" className="flex-1">
            Membership expiring soon
          </Label>
          <Switch
            id="email_membership_expiring"
            checked={formData.email_membership_expiring}
            onCheckedChange={(checked) => setFormData({ ...formData, email_membership_expiring: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_workshop_updates" className="flex-1">
            Workshop and event updates
          </Label>
          <Switch
            id="email_workshop_updates"
            checked={formData.email_workshop_updates}
            onCheckedChange={(checked) => setFormData({ ...formData, email_workshop_updates: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_order_updates" className="flex-1">
            Order and shipping updates
          </Label>
          <Switch
            id="email_order_updates"
            checked={formData.email_order_updates}
            onCheckedChange={(checked) => setFormData({ ...formData, email_order_updates: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="email_marketing" className="flex-1">
            Marketing and promotional emails
          </Label>
          <Switch
            id="email_marketing"
            checked={formData.email_marketing}
            onCheckedChange={(checked) => setFormData({ ...formData, email_marketing: checked })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">SMS Notifications</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="sms_booking_reminder" className="flex-1">
            Class reminders
          </Label>
          <Switch
            id="sms_booking_reminder"
            checked={formData.sms_booking_reminder}
            onCheckedChange={(checked) => setFormData({ ...formData, sms_booking_reminder: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sms_class_cancelled" className="flex-1">
            Class cancellations
          </Label>
          <Switch
            id="sms_class_cancelled"
            checked={formData.sms_class_cancelled}
            onCheckedChange={(checked) => setFormData({ ...formData, sms_class_cancelled: checked })}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </form>
  )
}
