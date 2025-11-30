"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Video, Mic, MicOff, VideoOff, MessageSquare, Users, Settings, Phone, Hand } from "lucide-react"
import { useState } from "react"

export default function LiveClassPage({ params }: { params: { id: string } }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showChat, setShowChat] = useState(true)

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-center text-white">
            <Video className="h-24 w-24 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Live Stream Placeholder</p>
            <p className="text-sm text-white/70 mt-2">In production, this would connect to Zoom/streaming service</p>
          </div>
        </div>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
              <span className="text-white font-semibold">Morning Vinyasa Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white text-sm">24 participants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isMuted ? "destructive" : "secondary"}
              className="rounded-full h-14 w-14"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              size="lg"
              variant={isVideoOff ? "destructive" : "secondary"}
              className="rounded-full h-14 w-14"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full h-14 w-14"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full h-14 w-14">
              <Hand className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full h-14 w-14">
              <Settings className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="destructive" className="rounded-full h-14 w-14">
              <Phone className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      {showChat && (
        <div className="w-80 bg-background border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { name: "Emma", message: "Loving this flow!", time: "10:15 AM" },
              { name: "Michael", message: "Can we hold warrior 2 longer?", time: "10:16 AM" },
              { name: "Sarah", message: "Great energy everyone!", time: "10:17 AM" },
            ].map((msg, i) => (
              <div key={i} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{msg.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{msg.name}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <input type="text" placeholder="Type a message..." className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}
