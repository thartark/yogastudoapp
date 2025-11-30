"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { User, Heart, Phone, FileText, Award, TrendingUp } from "lucide-react"
import { useMockData } from "@/lib/use-mock-data"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { getMockData } = useMockData()
  const [profileData, setProfileData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalBookings: 0,
    attendedClasses: 0,
    achievements: 0,
  })

  useEffect(() => {
    const data = getMockData()
    setProfileData(data.currentUser)

    // Calculate stats
    const totalBookings = data.bookings?.filter((b: any) => b.user_id === data.currentUser.id).length || 0
    const attendedClasses =
      data.bookings?.filter((b: any) => b.user_id === data.currentUser.id && b.checked_in).length || 0
    const achievements = data.achievements?.filter((a: any) => a.user_id === data.currentUser.id).length || 0

    setStats({ totalBookings, attendedClasses, achievements })
  }, [getMockData])

  if (!profileData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
            <p className="mt-2 text-lg text-muted-foreground">Manage your personal information and preferences</p>
          </div>
          <Button asChild>
            <Link href="/profile/edit">Edit Profile</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendedClasses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.achievements}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Member Since</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profileData.joined_date
                  ? new Date(profileData.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-base">{profileData?.full_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{profileData?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base">{profileData?.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-base">
                  {profileData?.date_of_birth
                    ? new Date(profileData.date_of_birth).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <Badge variant="secondary" className="capitalize">
                  {profileData?.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <CardTitle>Emergency Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{profileData?.emergency_contact_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base">{profileData?.emergency_contact_phone || "Not provided"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <CardTitle>Medical Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medical Notes</p>
                <p className="text-base">{profileData?.medical_notes || "None reported"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Account Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-base">
                  {profileData?.joined_date ? new Date(profileData.joined_date).toLocaleDateString() : "Not available"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <Badge variant="default" className="capitalize">
                  {profileData?.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/achievements">
              <Award className="mr-2 h-4 w-4" />
              View Achievements
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/community">
              <User className="mr-2 h-4 w-4" />
              Join Community
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full bg-transparent">
            <Link href="/dashboard">
              <TrendingUp className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
