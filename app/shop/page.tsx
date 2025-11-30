import { createClient } from "@/lib/supabase/server"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ShoppingCart, Package } from "lucide-react"
import { mockDataManager } from "@/lib/mock-data"

export default async function ShopPage() {
  const supabase = await createClient()

  let products: any[] = []
  let user: any = null

  if (!supabase) {
    const mockProducts = mockDataManager.getProducts()
    products = mockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock_quantity: p.stock_quantity,
      image_url: p.image_url,
      sku: p.sku,
      is_active: true,
      low_stock_threshold: 10,
    }))

    user = mockDataManager.getCurrentUser()
  } else {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser

    const { data } = await supabase.from("products").select("*").eq("is_active", true).order("category").order("name")

    products = data || []
  }

  const categories = Array.from(new Set(products?.map((p) => p.category) || []))

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-semibold">
            Prana Planner
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/classes">Classes</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/workshops">Workshops</Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/shop/cart">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Yoga Shop</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse our selection of yoga mats, props, apparel, and accessories
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/shop">All Products</Link>
          </Button>
          {categories.map((category) => (
            <Button key={category} variant="ghost" size="sm" asChild>
              <Link href={`/shop?category=${category}`} className="capitalize">
                {category}
              </Link>
            </Button>
          ))}
        </div>

        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryProducts = products?.filter((p) => p.category === category) || []

            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 capitalize">{category}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {categoryProducts.map((product: any) => (
                    <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <Package className="h-16 w-16 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      <div className="p-6 flex-1 flex flex-col">
                        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{product.description}</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                            {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                              <Badge variant="outline" className="text-xs">
                                Only {product.stock_quantity} left
                              </Badge>
                            )}
                            {product.stock_quantity === 0 && (
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          <Button asChild className="w-full" disabled={product.stock_quantity === 0}>
                            <Link href={`/shop/${product.id}`}>
                              {product.stock_quantity === 0 ? "Out of Stock" : "View Details"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No products available at the moment</p>
          </div>
        )}
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Prana Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
