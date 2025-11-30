import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: Request) {
  try {
    const { membershipTypeId, userId } = await request.json()

    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get membership type details
    const { data: membershipType, error: membershipError } = await supabase
      .from("membership_types")
      .select("*")
      .eq("id", membershipTypeId)
      .single()

    if (membershipError || !membershipType) {
      return NextResponse.json({ error: "Membership type not found" }, { status: 404 })
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: membershipType.price_cents,
      currency: "usd",
      metadata: {
        userId,
        membershipTypeId,
        membershipName: membershipType.name,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: membershipType.price_cents,
    })
  } catch (error: any) {
    console.error("[v0] Error creating payment intent:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
