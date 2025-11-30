"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface MockModeContextType {
  isMockMode: boolean
  setMockMode: (enabled: boolean) => void
}

const MockModeContext = createContext<MockModeContextType>({
  isMockMode: true,
  setMockMode: () => {},
})

export function MockModeProvider({ children }: { children: ReactNode }) {
  const [isMockMode, setIsMockMode] = useState(true)

  useEffect(() => {
    // Check if Supabase is configured
    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Auto-enable mock mode if Supabase is not configured
    if (!hasSupabase) {
      setIsMockMode(true)
    }
  }, [])

  return (
    <MockModeContext.Provider value={{ isMockMode, setMockMode: setIsMockMode }}>{children}</MockModeContext.Provider>
  )
}

export function useMockMode() {
  return useContext(MockModeContext)
}
