"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckoutDialog } from "@/components/checkout-dialog"

export function PurchaseMembershipButton({
  membershipTypeId,
  userId,
  disabled,
}: {
  membershipTypeId: string
  userId: string
  disabled?: boolean
}) {
  const [showCheckout, setShowCheckout] = useState(false)

  return (
    <>
      <Button onClick={() => setShowCheckout(true)} disabled={disabled} className="w-full">
        {disabled ? "Already Active" : "Purchase"}
      </Button>

      <CheckoutDialog
        open={showCheckout}
        onOpenChange={setShowCheckout}
        membershipTypeId={membershipTypeId}
        userId={userId}
      />
    </>
  )
}
