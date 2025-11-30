"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateWorkshopForm({ instructors }: { instructors: any[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    workshop_type: "workshop",
    instructor_id: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
    capacity: "",
    price: "",
    early_bird_price: "",
    early_bird_deadline: "",
    requirements: "",
    what_to_bring: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.from("workshops").insert({
        name: formData.name,
        description: formData.description,
        workshop_type: formData.workshop_type,
        instructor_id: formData.instructor_id || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location,
        capacity: Number.parseInt(formData.capacity),
        price: Number.parseFloat(formData.price),
        early_bird_price: formData.early_bird_price ? Number.parseFloat(formData.early_bird_price) : null,
        early_bird_deadline: formData.early_bird_deadline || null,
        requirements: formData.requirements || null,
        what_to_bring: formData.what_to_bring || null,
        is_active: true,
      })

      if (error) throw error

      alert("Workshop created successfully!")
      router.push("/admin/workshops")
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="name">Workshop Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="workshop_type">Type</Label>
          <Select
            value={formData.workshop_type}
            onValueChange={(value) => setFormData({ ...formData, workshop_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
              <SelectItem value="retreat">Retreat</SelectItem>
              <SelectItem value="special-event">Special Event</SelectItem>
              <SelectItem value="teacher-training">Teacher Training</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="instructor_id">Instructor</Label>
          <Select
            value={formData.instructor_id}
            onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.profiles?.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Main Studio, Beach, Mountain Retreat Center"
          />
        </div>

        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="early_bird_price">Early Bird Price ($)</Label>
          <Input
            id="early_bird_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.early_bird_price}
            onChange={(e) => setFormData({ ...formData, early_bird_price: e.target.value })}
            placeholder="Optional"
          />
        </div>

        <div>
          <Label htmlFor="early_bird_deadline">Early Bird Deadline</Label>
          <Input
            id="early_bird_deadline"
            type="date"
            value={formData.early_bird_deadline}
            onChange={(e) => setFormData({ ...formData, early_bird_deadline: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="e.g., Minimum 6 months yoga experience"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="what_to_bring">What to Bring</Label>
          <Textarea
            id="what_to_bring"
            value={formData.what_to_bring}
            onChange={(e) => setFormData({ ...formData, what_to_bring: e.target.value })}
            placeholder="e.g., Yoga mat, water bottle, comfortable clothing"
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Workshop"}
      </Button>
    </form>
  )
}
