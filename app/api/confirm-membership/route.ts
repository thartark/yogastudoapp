import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(request: Request) {
  try {
    const { paymentIntentId, userId, membershipTypeId } = await request.json()

    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
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

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + membershipType.validity_days)

    // Create membership
    const { data: membership, error: insertError } = await supabase
      .from("memberships")
      .insert({
        user_id: userId,
        membership_type_id: membershipTypeId,
        classes_remaining: membershipType.class_count,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        status: "active",
        stripe_payment_intent_id: paymentIntentId,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error creating membership:", insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, membership })
  } catch (error: any) {
    console.error("[v0] Error confirming membership:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
