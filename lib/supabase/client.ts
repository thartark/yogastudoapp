import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr"
import { createMockSupabaseClient } from "./mock-client"

const hasSupabaseConfig =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!hasSupabaseConfig) {
    console.log("[v0] Supabase not configured - using mock mode")
    return createMockSupabaseClient() as any
  }
  return createBrowserClientSSR(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export function createBrowserClient() {
  return createClient()
}
