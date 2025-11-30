"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart } from "lucide-react"

export function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItem = cart.find((item: any) => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ productId, quantity })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Added to cart!")
  }

  return (
    <div className="flex gap-3">
      <Input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
        className="w-20"
      />
      <Button onClick={handleAddToCart} disabled={disabled} className="flex-1">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>
    </div>
  )
}
