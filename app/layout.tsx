import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { MainNav } from "@/components/main-nav"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prana Planner",
  description: "Complete yoga studio management platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <MainNav />
        <div className="flex-1">{children}</div>
        <footer className="border-t mt-auto">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground/60">Built by Hayarta</p>
          </div>
        </footer>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
