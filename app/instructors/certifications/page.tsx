"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, AlertCircle, Calendar, Plus, CheckCircle } from "lucide-react"

export default function CertificationsPage() {
  const certifications = [
    {
      id: "cert-1",
      name: "RYT-500",
      issuer: "Yoga Alliance",
      status: "active",
      issueDate: "2022-06-15",
      expiryDate: "2025-06-15",
      daysUntilExpiry: 502,
      renewalRequired: false,
    },
    {
      id: "cert-2",
      name: "Prenatal Yoga Certification",
      issuer: "YogaBirth",
      status: "active",
      issueDate: "2023-03-20",
      expiryDate: "2026-03-20",
      daysUntilExpiry: 780,
      renewalRequired: false,
    },
    {
      id: "cert-3",
      name: "Yin Yoga Teacher Training",
      issuer: "Yin Yoga Institute",
      status: "expiring_soon",
      issueDate: "2021-01-10",
      expiryDate: "2025-02-10",
      daysUntilExpiry: 13,
      renewalRequired: true,
    },
  ]

  const continuingEducation = [
    {
      id: "ce-1",
      name: "Advanced Anatomy for Yoga Teachers",
      provider: "Yoga Medicine",
      hours: 20,
      completed: 12,
      deadline: "2025-04-30",
      status: "in_progress",
    },
    {
      id: "ce-2",
      name: "Trauma-Informed Yoga",
      provider: "Mindful Schools",
      hours: 15,
      completed: 15,
      deadline: "2024-12-31",
      status: "completed",
    },
    {
      id: "ce-3",
      name: "Business of Yoga",
      provider: "Yoga Business Academy",
      hours: 10,
      completed: 0,
      deadline: "2025-06-15",
      status: "not_started",
    },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">Certifications & Training</h1>
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certifications.filter((c) => c.status === "active").length}</div>
                <p className="text-xs text-muted-foreground">Current certifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certifications.filter((c) => c.renewalRequired).length}</div>
                <p className="text-xs text-muted-foreground">Needs renewal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CE Hours</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {continuingEducation.reduce((sum, ce) => sum + ce.completed, 0)} hrs
                </div>
                <p className="text-xs text-muted-foreground">Completed this year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Certifications</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Award className={`h-8 w-8 ${cert.renewalRequired ? "text-destructive" : "text-green-600"}`} />
                      <div>
                        <div className="font-semibold">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">
                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={cert.renewalRequired ? "destructive" : "secondary"}>
                          {cert.renewalRequired ? "Renewal Required" : "Active"}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{cert.daysUntilExpiry} days remaining</div>
                      </div>
                      {cert.renewalRequired && <Button size="sm">Renew</Button>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continuing Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {continuingEducation.map((ce) => (
                  <div key={ce.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{ce.name}</div>
                        <div className="text-sm text-muted-foreground">{ce.provider}</div>
                      </div>
                      <Badge
                        variant={
                          ce.status === "completed" ? "secondary" : ce.status === "in_progress" ? "default" : "outline"
                        }
                      >
                        {ce.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {ce.completed}/{ce.hours} hours
                        </span>
                      </div>
                      <Progress value={(ce.completed / ce.hours) * 100} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Deadline: {new Date(ce.deadline).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm">
                        {ce.status === "not_started" ? "Start Course" : "Continue"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
