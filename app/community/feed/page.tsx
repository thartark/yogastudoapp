"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share2, ImageIcon } from "lucide-react"

export default function CommunityFeedPage() {
  const [posts, setPosts] = useState([
    {
      id: "1",
      author: "Sarah Johnson",
      authorAvatar: "/yoga-instructor-woman.png",
      role: "Instructor",
      content:
        "Just wrapped up an amazing Vinyasa Flow class this morning! The energy was incredible. Remember, yoga is not about touching your toes, it's about what you learn on the way down. Namaste!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      image: null,
    },
    {
      id: "2",
      author: "John Doe",
      authorAvatar: "/diverse-user-avatars.png",
      role: "Member",
      content:
        "Finally nailed my first headstand today! Been working on this for months. Thank you Emma for the amazing tips and encouragement!",
      timestamp: "5 hours ago",
      likes: 42,
      comments: 12,
      image: null,
    },
    {
      id: "3",
      author: "Emma Rodriguez",
      authorAvatar: "/yoga-instructor-woman-2.jpg",
      role: "Instructor",
      content:
        "Reminder: Workshop on Advanced Inversions this Saturday! We still have 5 spots available. Come push your limits in a safe, supportive environment.",
      timestamp: "Yesterday",
      likes: 18,
      comments: 8,
      image: "/yoga-inversions.jpg",
    },
  ])

  return (
    <div className="container mx-auto py-8 max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community Feed</h1>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>YN</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share your yoga journey, ask questions, or inspire others..."
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                <Button>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{post.author}</p>
                    <Badge variant="secondary" className="text-xs">
                      {post.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{post.content}</p>
              {post.image && (
                <img src={post.image || "/placeholder.svg"} alt="Post content" className="w-full rounded-lg border" />
              )}
              <div className="flex items-center gap-6 pt-2 border-t">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
