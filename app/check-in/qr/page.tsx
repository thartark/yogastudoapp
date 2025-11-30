"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Share2, Smartphone } from "lucide-react"

export default function QRCheckInPage() {
  // In production, this would generate a unique QR code for the user
  const userId = "USER123456"
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${userId}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Check-In QR Code</h1>
          <p className="text-muted-foreground">Use this QR code for quick check-in at the studio</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Personal QR Code
            </CardTitle>
            <CardDescription>This code is unique to you and can be scanned at the front desk or kiosk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center p-8 bg-white rounded-lg border-2 border-dashed">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Add to Wallet
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Save to Your Phone</h4>
                <p className="text-sm text-muted-foreground">
                  Download the QR code or add it to your Apple/Google Wallet for easy access
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Arrive at the Studio</h4>
                <p className="text-sm text-muted-foreground">Open your QR code when you arrive at the studio</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Scan at Kiosk or Front Desk</h4>
                <p className="text-sm text-muted-foreground">
                  Present your QR code to the scanner for instant check-in
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-start gap-4">
            <Smartphone className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-800">
                Take a screenshot of your QR code or add it to your phone's home screen for the fastest check-in
                experience. You can also find it anytime in the mobile app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
