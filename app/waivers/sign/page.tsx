"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, PenTool, Check } from "lucide-react"

export default function SignWaiverPage() {
  const [signature, setSignature] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Liability Waiver</h1>
          <p className="text-muted-foreground">Please read and sign the waiver before attending classes</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Required for waiver documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergency-contact">Emergency Contact Name *</Label>
                <Input
                  id="emergency-contact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency-phone">Emergency Contact Phone *</Label>
                <Input
                  id="emergency-phone"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="(555) 987-6543"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Waiver Agreement</CardTitle>
            <CardDescription>Please read carefully before signing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-64 overflow-y-auto p-4 border rounded-lg bg-muted/20 text-sm space-y-3">
              <p className="font-semibold">ASSUMPTION OF RISK AND WAIVER OF LIABILITY</p>
              <p>
                I understand that yoga, Pilates, and physical fitness activities of any nature may carry the risk of
                injury. I voluntarily assume all risks associated with participation.
              </p>
              <p>
                I acknowledge that I am in good physical condition and have no disability, impairment, or ailment
                preventing me from engaging in active or passive exercise that will be detrimental to my heart, safety,
                or comfort, or physical condition if I engage or participate in physical activity.
              </p>
              <p>
                I understand that it is my responsibility to inform the instructor of any health conditions or injuries
                before class begins and to modify or discontinue any pose or exercise that causes pain or discomfort.
              </p>
              <p>
                I hereby release, waive, discharge, and covenant not to sue Prana Planner Yoga Studio, its owners,
                instructors, employees, and agents from any and all liability for any loss or damage, and any claim or
                demands therefore on account of injury to my person or property or resulting in my death, whether caused
                by the negligence or otherwise, while participating in any activities at the studio.
              </p>
              <p className="font-semibold">COVID-19 ACKNOWLEDGMENT</p>
              <p>
                I acknowledge the contagious nature of COVID-19 and other infectious diseases and voluntarily assume the
                risk that I may be exposed to or infected by attending the studio, and that such exposure may result in
                personal injury, illness, or death.
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
              <label
                htmlFor="agree"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to the terms of this waiver. I understand that I am giving up substantial rights,
                including my right to sue.
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Digital Signature
            </CardTitle>
            <CardDescription>Sign with your mouse or touchscreen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 bg-muted/20">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full border border-border rounded bg-white cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearSignature}>
                Clear Signature
              </Button>
              <p className="text-sm text-muted-foreground">Sign above using your mouse or touchscreen</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Button size="lg" className="w-full" disabled={!agreed || !formData.name || !formData.email}>
              <Check className="h-5 w-5 mr-2" />
              Submit Waiver
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              By submitting, you agree that your signature is legally binding
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
