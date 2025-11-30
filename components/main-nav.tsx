"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { createBrowserClient } from "@/lib/supabase/client"
import { getMockDataManager } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createBrowserClient()
  const useMockMode = !supabase

  useEffect(() => {
    const getUser = async () => {
      if (useMockMode) {
        const mockManager = getMockDataManager()
        const mockUser = mockManager.getCurrentUser()
        setUser({ id: mockUser.id, email: mockUser.email })
        setProfile(mockUser)
        return
      }

      if (!supabase) return

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(profile)
      }
    }
    getUser()
  }, [useMockMode, supabase])

  const handleSignOut = async () => {
    if (useMockMode) {
      setUser(null)
      setProfile(null)
      setMobileOpen(false)
      router.push("/")
      return
    }

    if (supabase) {
      await supabase.auth.signOut()
    }
    setMobileOpen(false)
    router.push("/")
    router.refresh()
  }

  const isAdmin = profile?.role === "admin"
  const isInstructor = profile?.role === "instructor"

  // Don't show nav on auth pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  const navLinks = [
    { href: "/classes", label: "Classes" },
    { href: "/private-sessions", label: "Private" },
    { href: "/workshops", label: "Workshops" },
    { href: "/memberships", label: "Plans" },
    { href: "/shop", label: "Shop" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 gap-4">
        <Link href="/" className="text-lg font-semibold whitespace-nowrap shrink-0">
          Prana Planner
        </Link>

        <nav className="hidden lg:flex gap-4 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild className="hidden sm:flex bg-transparent">
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              {isInstructor && !isAdmin && (
                <Button variant="outline" size="sm" asChild className="hidden sm:flex bg-transparent">
                  <Link href="/instructor/dashboard">Instructor</Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {profile?.full_name || user.email?.split("@")[0] || "User"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">Notifications</Link>
                  </DropdownMenuItem>
                  {isInstructor && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/instructor/availability">Availability</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/instructor/time-off">Time Off</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild className="sm:hidden">
                      <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Start</Link>
              </Button>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === link.href ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <hr className="my-2" />
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-muted-foreground hover:text-primary"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {useMockMode && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-1 text-center text-xs text-yellow-700 dark:text-yellow-400">
          Running in demo mode with sample data
        </div>
      )}
    </header>
  )
}
