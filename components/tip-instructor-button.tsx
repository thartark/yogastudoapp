"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"

interface TipInstructorButtonProps {
  instructorId: string
  instructorName: string
  classInstanceId?: string
}

export function TipInstructorButton({ instructorId, instructorName, classInstanceId }: TipInstructorButtonProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleTip = async () => {
    if (!amount || Number(amount) <= 0) return

    setLoading(true)
    const supabase = createClient()

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount) * 100, // Convert to cents
          description: `Tip for ${instructorName}`,
        }),
      })

      const { clientSecret, paymentIntentId } = await response.json()

      // For simplicity, we'll just record the tip
      // In production, you'd integrate Stripe Elements here
      const { error } = await supabase.from("instructor_tips").insert({
        instructor_id: instructorId,
        amount: Number(amount),
        class_instance_id: classInstanceId,
        payment_intent_id: paymentIntentId,
        message,
      })

      if (error) throw error

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error processing tip:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          Tip Instructor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tip {instructorName}</DialogTitle>
          <DialogDescription>Show your appreciation with a tip</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="10.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Thank you for the great class!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button onClick={handleTip} disabled={loading || !amount} className="w-full">
            {loading ? "Processing..." : `Send $${amount || "0"} Tip`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
