"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Send, Users, TrendingUp } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export default function CommunityPage() {
  const { getMockData } = useMockData()
  const [posts, setPosts] = useState<any[]>([])
  const [newPost, setNewPost] = useState("")

  useEffect(() => {
    const data = getMockData()
    // Get community posts from notifications (simulating posts)
    const communityPosts = (data.notifications || [])
      .filter((n: any) => n.type === "class" || n.type === "promotion")
      .slice(0, 10)
      .map((n: any) => ({
        id: n.id,
        content: n.message,
        author: "Yoga Studio",
        created_at: n.created_at,
        likes_count: (Number.parseInt(n.id.split("-")[1] || "5", 10) % 20) + 5,
        comments_count: (Number.parseInt(n.id.split("-")[1] || "1", 10) % 10) + 1,
      }))

    setPosts(communityPosts)
  }, []) // Removed getMockData from dependencies to prevent re-renders

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    // Add new post to the top
    const newPostObj = {
      id: Date.now().toString(),
      content: newPost,
      author: "You",
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
    }

    setPosts([newPostObj, ...posts])
    setNewPost("")
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">Connect with fellow yogis and share your journey</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Community Members</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Posts This Week</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Your Posts</p>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((p) => p.author === "You").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmitPost}>
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your yoga journey, tips, or experiences..."
              className="mb-4"
              rows={3}
            />
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Share Post
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                      {post.author[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-muted-foreground">{formatTimeAgo(post.created_at)}</p>
                    </div>
                  </div>
                  {post.author === "You" && <Badge variant="secondary">Your Post</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes_count}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments_count}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
