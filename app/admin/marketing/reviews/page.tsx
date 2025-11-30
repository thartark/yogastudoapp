"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, MessageCircle, ExternalLink } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"

export default function ReviewsPage() {
  const { reviews } = useMockData()
  const [selectedReview, setSelectedReview] = useState<any>(null)

  const averageRating = reviews?.reduce((sum: number, r: any) => sum + r.rating, 0) / (reviews?.length || 1)
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews?.filter((r: any) => r.rating === stars).length || 0,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews & Testimonials</h1>
          <p className="text-muted-foreground">Manage client feedback and ratings</p>
        </div>
        <Button>
          <ExternalLink className="mr-2 h-4 w-4" />
          Request Reviews
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">From {reviews?.length} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reviews?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">New reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Reviews replied to</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest feedback from your clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews?.map((review: any) => (
              <div key={review.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{review.user_name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown by star rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{dist.stars}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(dist.count / (reviews?.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{dist.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Collection Tools</CardTitle>
          <CardDescription>Automate and simplify getting client feedback</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Email Requests</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically send review requests after class completion
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              Configure
            </Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">QR Code</h4>
            <p className="text-sm text-muted-foreground mb-4">Display in studio for instant review submissions</p>
            <Button variant="outline" className="w-full bg-transparent">
              Generate QR
            </Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Google Integration</h4>
            <p className="text-sm text-muted-foreground mb-4">Direct link to your Google Business reviews</p>
            <Button variant="outline" className="w-full bg-transparent">
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Testimonials</CardTitle>
          <CardDescription>Showcase your best reviews on your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {reviews
            ?.filter((r: any) => r.rating === 5)
            .slice(0, 3)
            .map((review: any) => (
              <div key={review.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{review.user_name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
