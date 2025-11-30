import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ShoppingCart, Package, Truck, Shield, RefreshCw } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { mockDataManager } from "@/lib/mock-data"

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  let product: any = null
  let user: any = null

  if (!supabase) {
    const mockProduct = mockDataManager.getProduct(id)
    if (!mockProduct) {
      notFound()
    }

    product = {
      id: mockProduct.id,
      name: mockProduct.name,
      description: mockProduct.description,
      price: mockProduct.price,
      category: mockProduct.category,
      stock_quantity: mockProduct.stock_quantity,
      image_url: mockProduct.image_url,
      sku: mockProduct.sku,
      is_active: true,
      low_stock_threshold: 10,
    }

    user = mockDataManager.getCurrentUser()
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    const { data } = await supabase.from("products").select("*").eq("id", id).eq("is_active", true).single()

    if (!data) {
      notFound()
    }
    product = data
  }

  const isLowStock = product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0
  const isOutOfStock = product.stock_quantity === 0

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Prana Planner
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/shop">Back to Shop</Link>
            </Button>
            {user && (
              <Button variant="ghost" asChild>
                <Link href="/shop/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center sticky top-4">
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <Package className="h-24 w-24 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2 capitalize">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
              {product.sku && <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {isLowStock && (
                <Badge variant="outline" className="text-amber-600">
                  Only {product.stock_quantity} left
                </Badge>
              )}
              {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
              {!isOutOfStock && !isLowStock && <Badge variant="secondary">In Stock</Badge>}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </Card>
              <Card className="text-center p-4">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </Card>
              <Card className="text-center p-4">
                <RefreshCw className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </Card>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {product.stock_quantity > 0
                  ? "In stock and ready to ship within 2-3 business days"
                  : "Currently unavailable - check back soon"}
              </span>
            </div>

            {user ? (
              <div className="space-y-3">
                <AddToCartButton productId={product.id} disabled={isOutOfStock} />
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full" size="lg">
                <Link href="/auth/login">Sign in to purchase</Link>
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Shipping & Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Free standard shipping on orders over $50. Express shipping available at checkout. Most orders ship
                    within 2-3 business days.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Returns & Exchanges</h3>
                  <p className="text-sm text-muted-foreground">
                    We offer a 30-day return policy on all products. Items must be unused and in original packaging.
                    Contact us to initiate a return.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Care Instructions</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow care instructions on product labels. Most yoga mats can be cleaned with mild soap and water.
                    Air dry completely before rolling.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Questions?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our customer service team for product questions, sizing help, or order assistance. We're
                    here to help!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Prana Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
