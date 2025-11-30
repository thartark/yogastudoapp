"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const COLOR_PRESETS = [
  { name: "Green", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Red", value: "#ef4444" },
]

export function CreateClassForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [instructors, setInstructors] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructor_id: "",
    duration_minutes: "60",
    capacity: "20",
    difficulty_level: "all_levels",
    class_type: "Hatha",
    color_code: "#10b981",
    preferred_room_id: "",
    auto_assign_room: false,
    location_id: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: instructorData } = await supabase
        .from("instructors")
        .select("id, profiles!instructors_user_id_fkey(full_name)")
        .eq("is_active", true)

      const { data: roomData } = await supabase.from("rooms").select("id, name, location_id").eq("is_active", true)

      const { data: locationData } = await supabase.from("locations").select("id, name").eq("is_active", true)

      if (instructorData) setInstructors(instructorData)
      if (roomData) setRooms(roomData)
      if (locationData) setLocations(locationData)
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("classes").insert({
        name: formData.name,
        description: formData.description,
        instructor_id: formData.instructor_id || null,
        duration_minutes: Number.parseInt(formData.duration_minutes),
        capacity: Number.parseInt(formData.capacity),
        difficulty_level: formData.difficulty_level,
        class_type: formData.class_type,
        color_code: formData.color_code,
        preferred_room_id: formData.preferred_room_id || null,
        auto_assign_room: formData.auto_assign_room,
        location_id: formData.location_id || null,
        is_active: true,
      })

      if (insertError) throw insertError

      router.push("/admin/classes")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Flow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_type">Class Type *</Label>
              <Input
                id="class_type"
                required
                value={formData.class_type}
                onChange={(e) => setFormData({ ...formData, class_type: e.target.value })}
                placeholder="e.g., Hatha, Vinyasa, Yin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the class..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
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
                      {instructor.profiles?.full_name || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty Level *</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all_levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="color_code">Class Color</Label>
              <div className="flex gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className="h-8 w-8 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color.value,
                      borderColor: formData.color_code === color.value ? "#000" : "transparent",
                    }}
                    onClick={() => setFormData({ ...formData, color_code: color.value })}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_id">Location</Label>
              <Select
                value={formData.location_id}
                onValueChange={(value) => setFormData({ ...formData, location_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferred_room_id">Preferred Room</Label>
              <Select
                value={formData.preferred_room_id}
                onValueChange={(value) => setFormData({ ...formData, preferred_room_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto_assign_room"
                  checked={formData.auto_assign_room}
                  onCheckedChange={(checked) => setFormData({ ...formData, auto_assign_room: checked as boolean })}
                />
                <Label htmlFor="auto_assign_room" className="text-sm font-normal">
                  Auto-assign room
                </Label>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes) *</Label>
              <Input
                id="duration_minutes"
                type="number"
                required
                min="15"
                max="180"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                required
                min="1"
                max="100"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Class"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
