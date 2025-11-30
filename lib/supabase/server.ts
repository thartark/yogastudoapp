import { createServerClient as createServerClientSSR } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createMockSupabaseClient } from "./mock-client"

export const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function createClient() {
  if (isMockMode) {
    console.log("[v0] Supabase not configured - using mock data mode")
    return createMockSupabaseClient() as any
  }

  const cookieStore = await cookies()

  return createServerClientSSR(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function createServerClient() {
  return createClient()
}
