"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import Link from "next/link"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function AdminProductsPage() {
  const { getMockData } = useMockData()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const data = getMockData()
    setProducts(data.products || [])
  }, [getMockData])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your retail inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products && products.length > 0 ? (
          products.map((product: any) => (
            <Card key={product.id}>
              <CardHeader className="pb-3">
                {product.image_url && (
                  <div className="relative h-48 w-full mb-3 rounded-md overflow-hidden">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <Badge
                    variant={
                      product.stock_quantity === 0
                        ? "destructive"
                        : product.stock_quantity < 10
                          ? "secondary"
                          : "default"
                    }
                  >
                    {product.stock_quantity === 0
                      ? "Out of Stock"
                      : product.stock_quantity < 10
                        ? "Low Stock"
                        : "In Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">{product.stock_quantity}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Restock
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
