"use client"

import { getMockData as getStoredMockData } from "./mock-data"

export function useMockData() {
  const getMockData = () => {
    return getStoredMockData()
  }

  return {
    getMockData,
  }
}
