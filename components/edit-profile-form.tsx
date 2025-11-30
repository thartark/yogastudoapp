"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function EditProfileForm({ profile }: { profile: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    date_of_birth: profile?.date_of_birth || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    zip_code: profile?.zip_code || "",
    emergency_contact_name: profile?.emergency_contact_name || "",
    emergency_contact_phone: profile?.emergency_contact_phone || "",
    emergency_contact_relationship: profile?.emergency_contact_relationship || "",
    medical_conditions: profile?.medical_conditions || "",
    injuries: profile?.injuries || "",
    medications: profile?.medications || "",
    allergies: profile?.allergies || "",
    experience_level: profile?.experience_level || "",
    goals: profile?.goals || "",
    preferences: profile?.preferences || "",
    notes: profile?.notes || "",
    waiver_signed: profile?.waiver_signed || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const updateData: any = { ...formData }

      // Add waiver timestamp if signing for first time
      if (formData.waiver_signed && !profile?.waiver_signed) {
        updateData.waiver_signed_at = new Date().toISOString()
      }

      const { error } = await supabase.from("profiles").update(updateData).eq("id", profile.id)

      if (error) throw error

      alert("Profile updated successfully!")
      router.push("/profile")
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
        <h3 className="text-lg font-semibold">Personal Information</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="zip_code">ZIP Code</Label>
            <Input
              id="zip_code"
              value={formData.zip_code}
              onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="emergency_contact_name">Name</Label>
            <Input
              id="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="emergency_contact_phone">Phone</Label>
            <Input
              id="emergency_contact_phone"
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="emergency_contact_relationship">Relationship</Label>
          <Input
            id="emergency_contact_relationship"
            value={formData.emergency_contact_relationship}
            onChange={(e) => setFormData({ ...formData, emergency_contact_relationship: e.target.value })}
            placeholder="e.g., Spouse, Parent, Sibling"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical Information</h3>

        <div>
          <Label htmlFor="medical_conditions">Medical Conditions</Label>
          <Textarea
            id="medical_conditions"
            value={formData.medical_conditions}
            onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
            placeholder="Any medical conditions we should be aware of"
          />
        </div>

        <div>
          <Label htmlFor="injuries">Injuries</Label>
          <Textarea
            id="injuries"
            value={formData.injuries}
            onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
            placeholder="Current or past injuries"
          />
        </div>

        <div>
          <Label htmlFor="medications">Medications</Label>
          <Textarea
            id="medications"
            value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            placeholder="Current medications"
          />
        </div>

        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            placeholder="Any allergies"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Yoga Practice</h3>

        <div>
          <Label htmlFor="experience_level">Experience Level</Label>
          <Select
            value={formData.experience_level}
            onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goals">Goals</Label>
          <Textarea
            id="goals"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            placeholder="What are your yoga goals?"
          />
        </div>

        <div>
          <Label htmlFor="preferences">Preferences</Label>
          <Textarea
            id="preferences"
            value={formData.preferences}
            onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
            placeholder="Any preferences or special requests"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="waiver_signed"
          checked={formData.waiver_signed}
          onCheckedChange={(checked) => setFormData({ ...formData, waiver_signed: checked as boolean })}
        />
        <Label htmlFor="waiver_signed" className="text-sm font-normal">
          I have read and agree to the liability waiver
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/profile">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
