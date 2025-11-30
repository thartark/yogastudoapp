"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({
  membershipTypeId,
  userId,
  onSuccess,
}: {
  membershipTypeId: string
  userId: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "An error occurred")
        setIsLoading(false)
        return
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setIsLoading(false)
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm membership creation
        const response = await fetch("/api/confirm-membership", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            userId,
            membershipTypeId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create membership")
        }

        onSuccess()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Processing..." : "Complete Purchase"}
      </Button>
    </form>
  )
}

export function CheckoutDialog({
  open,
  onOpenChange,
  membershipTypeId,
  userId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  membershipTypeId: string
  userId: string
}) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && !clientSecret) {
      setIsLoading(true)
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipTypeId, userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("[v0] Error creating payment intent:", err)
          setIsLoading(false)
        })
    }
  }, [open, membershipTypeId, userId, clientSecret])

  const handleSuccess = () => {
    onOpenChange(false)
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>Enter your payment details to activate your membership</DialogDescription>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Loading payment form...</p>}

        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <CheckoutForm membershipTypeId={membershipTypeId} userId={userId} onSuccess={handleSuccess} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}
