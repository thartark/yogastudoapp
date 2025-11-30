import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function StaffDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const { data: staff } = await supabase
    .from("profiles")
    .select(`
      *,
      instructor_tier:instructor_tiers(*),
      certifications(*),
      instructor_specialties(*),
      time_off_requests(*),
      performance_reviews(*),
      staff_hours(*)
    `)
    .eq("id", params.id)
    .single()

  if (!staff) notFound()

  const totalHours = staff.staff_hours?.reduce((sum: number, h: any) => sum + (h.hours_worked || 0), 0) || 0
  const avgRating = staff.performance_reviews?.length
    ? staff.performance_reviews.reduce((sum: number, r: any) => sum + r.overall_rating, 0) /
      staff.performance_reviews.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{staff.full_name}</h1>
          <p className="text-muted-foreground">{staff.email}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/staff/${params.id}/edit`}>Edit Profile</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/staff/${params.id}/review`}>Add Review</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.instructor_tier?.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Level {staff.instructor_tier?.level || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{staff.performance_reviews?.length || 0} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.certifications?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Teaching Style</p>
                  <p className="text-sm text-muted-foreground">{staff.teaching_style || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Years Experience</p>
                  <p className="text-sm text-muted-foreground">{staff.years_experience || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Hourly Rate</p>
                  <p className="text-sm text-muted-foreground">
                    ${staff.hourly_rate || staff.instructor_tier?.base_rate || 0}/hr
                  </p>
                </div>
              </div>

              {staff.bio && (
                <div>
                  <p className="text-sm font-medium">Bio</p>
                  <p className="text-sm text-muted-foreground">{staff.bio}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {staff.instructor_specialties?.map((spec: any) => (
                    <Badge key={spec.id} variant="secondary">
                      {spec.specialty} - {spec.proficiency_level}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{staff.emergency_contact_name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{staff.emergency_contact_phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Relationship</p>
                <p className="text-sm text-muted-foreground">
                  {staff.emergency_contact_relationship || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.certifications?.map((cert: any) => (
                  <div key={cert.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-muted-foreground">{cert.issuing_organization}</p>
                        <p className="text-xs text-muted-foreground">
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                          {cert.expiration_date && ` | Expires: ${new Date(cert.expiration_date).toLocaleDateString()}`}
                        </p>
                        {cert.continuing_education_hours > 0 && (
                          <p className="text-xs text-muted-foreground">CE Hours: {cert.continuing_education_hours}</p>
                        )}
                      </div>
                      <Badge variant={cert.status === "active" ? "default" : "destructive"}>{cert.status}</Badge>
                    </div>
                  </div>
                ))}
                {(!staff.certifications || staff.certifications.length === 0) && (
                  <p className="text-sm text-muted-foreground">No certifications on file</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Availability management coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staff.performance_reviews?.map((review: any) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{new Date(review.review_date).toLocaleDateString()}</p>
                      <Badge>{review.overall_rating}/5</Badge>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Teaching Quality:</span>
                        <span>{review.teaching_quality}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Professionalism:</span>
                        <span>{review.professionalism}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Punctuality:</span>
                        <span>{review.punctuality}/5</span>
                      </div>
                    </div>
                    {review.strengths && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Strengths:</p>
                        <p className="text-sm text-muted-foreground">{review.strengths}</p>
                      </div>
                    )}
                  </div>
                ))}
                {(!staff.performance_reviews || staff.performance_reviews.length === 0) && (
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Document management coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
