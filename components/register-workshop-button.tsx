"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({
  workshopId,
  userId,
  price,
  onSuccess,
}: {
  workshopId: string
  userId: string
  price: number
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) throw submitError

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/workshops/${workshopId}`,
        },
        redirect: "if_required",
      })

      if (error) throw error

      // Register for workshop
      const supabase = createClient()
      const { error: regError } = await supabase.from("workshop_registrations").insert({
        workshop_id: workshopId,
        user_id: userId,
        amount_paid: price,
        status: "confirmed",
      })

      if (regError) throw regError

      onSuccess()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? "Processing..." : `Pay $${price}`}
      </Button>
    </form>
  )
}

export function RegisterWorkshopButton({
  workshopId,
  userId,
  price,
  disabled,
}: {
  workshopId: string
  userId: string
  price: number
  disabled?: boolean
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    setIsLoading(true)
    setIsOpen(true)

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(price * 100),
          description: "Workshop Registration",
        }),
      })

      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (err: any) {
      alert(err.message)
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    setIsOpen(false)
    alert("Successfully registered for workshop!")
    router.refresh()
  }

  return (
    <>
      <Button onClick={handleRegister} disabled={disabled || isLoading} className="w-full">
        {isLoading ? "Loading..." : "Register Now"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Registration</DialogTitle>
          </DialogHeader>
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm workshopId={workshopId} userId={userId} price={price} onSuccess={handleSuccess} />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
