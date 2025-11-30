import { createClient } from "@/lib/supabase/server"

export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function requireRole(allowedRoles: string[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, user: null, profile: null }
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    return { authorized: false, user, profile }
  }

  return { authorized: true, user, profile }
}

export async function checkPermission(permission: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  // Check if user is admin (admins have all permissions)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role === "admin") {
    return true
  }

  // Check specific permission
  const { data: permissions } = await supabase
    .from("role_permissions")
    .select("permission")
    .eq("user_id", user.id)
    .eq("permission", permission)
    .single()

  return !!permissions
}
