import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"

export default function GuestPassPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Guest Pass</h1>
        <p className="text-muted-foreground">Redeem your guest pass to try a class</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Enter Guest Pass Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/guest-pass/redeem" method="POST" className="space-y-4">
            <div>
              <Label htmlFor="code">Guest Pass Code</Label>
              <Input id="code" name="code" placeholder="Enter your code" required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <Button type="submit" className="w-full">
              Redeem Guest Pass
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
