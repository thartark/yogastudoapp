import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewLocationPage() {
  async function createLocation(formData: FormData) {
    "use server"
    const supabase = await createServerClient()

    const locationData = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip_code: formData.get("zip_code") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      is_active: formData.get("is_active") === "on",
    }

    await supabase.from("locations").insert(locationData)
    redirect("/admin/locations")
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Location</h1>
        <p className="text-muted-foreground">Create a new studio location</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Enter the information for the new location</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createLocation} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" name="name" placeholder="Main Studio" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="123 Yoga Street" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="San Francisco" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" placeholder="CA" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input id="zip_code" name="zip_code" placeholder="94102" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="info@studio.com" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_active" name="is_active" defaultChecked />
              <Label htmlFor="is_active" className="text-sm font-normal">
                Active location
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Create Location</Button>
              <Button type="button" variant="outline" asChild>
                <a href="/admin/locations">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
