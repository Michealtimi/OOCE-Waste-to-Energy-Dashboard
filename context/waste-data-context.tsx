"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

export interface WasteSubmission {
  id: string
  date: string
  lga: string
  pspOperator: string
  tons: number
  wasteType: string
  energyKWh: number
  carbonCredits: number
}

interface WasteDataContextType {
  submissions: WasteSubmission[]
  addSubmission: (submission: Omit<WasteSubmission, "id" | "energyKWh" | "carbonCredits" | "date"> & { date: string }) => Promise<void>
}

const WasteDataContext = createContext<WasteDataContextType | undefined>(undefined)

export const LGAS = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
  "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaaye",
  "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
  "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
]

export const PSP_OPERATORS = [
  "CleanLagos Services",
  "EcoWaste Management",
  "GreenCity Collectors",
  "WasteNet Solutions",
  "Urban Sanitation Ltd"
]

export const WASTE_TYPES = ["Organic", "Plastic", "Mixed", "Inert"]

function generateMockData(): WasteSubmission[] {
  const submissions: WasteSubmission[] = []
  const today = new Date()

  for (let i = 0; i < 50; i++) { // Increased to 50 for more data
    const daysAgo = Math.floor(Math.random() * 14)
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)

    const tons = Math.round((Math.random() * 50 + 10) * 10) / 10
    const energyKWh = tons * 650
    const carbonCredits = tons * 0.42

    submissions.push({
      id: `mock-${i + 1}`,
      date: date.toISOString().split("T")[0],
      lga: LGAS[Math.floor(Math.random() * LGAS.length)],
      pspOperator: PSP_OPERATORS[Math.floor(Math.random() * PSP_OPERATORS.length)],
      tons,
      wasteType: WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)],
      energyKWh,
      carbonCredits,
    })
  }
  return submissions
}

export function WasteDataProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([])

  const initializeData = useCallback(async () => {
    try {
      // 1. Generate mock data
      let mockData = generateMockData(); // Keep mock data as a fallback

      // 2. Fetch real, persisted submissions
      const res = await fetch("/api/submit")
      // Added console.error for better debugging if API fails
      if (!res.ok) {
        console.error(`API fetch failed with status: ${res.status}`);
        // If API fails, we still want to use mock data
        throw new Error("Failed to fetch persisted data from API.");
      }
      const persistedData = await res.json()

      // 3. Combine and set the state, sorting by date
      const combinedData = [...persistedData.submissions, ...mockData].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSubmissions(combinedData)
    } catch (error) {
      console.error("Failed to fetch submissions:", error)
      // Fallback to just mock data if API fails
      setSubmissions(generateMockData())
    }
  }, [])

  useEffect(() => {
    initializeData()
  }, [initializeData])

  const addSubmission = async (submission: Omit<WasteSubmission, "id" | "energyKWh" | "carbonCredits" | "date"> & { date: string }) => {
    console.log({payload: submission})
    try {
      console.log("Attempting to submit data:", submission);
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })

      // Improved error handling for non-OK responses. This will now log the actual HTML "Not Found" page content if the 404 persists,
      // which is useful for debugging if the API route is still not found.
      // This is crucial for debugging the 404.
      if (!res.ok) {
        console.log({res})
        const errorBody = await res.text();
        console.error("API submission response not OK:", res.status, errorBody); // Log the full response body
        throw new Error(`API submission failed with status ${res.status}: ${errorBody.substring(0, 200)}...`); // Truncate for error message
      }
      const result = await res.json();
      console.log("Submission successful, received:", result);
      setSubmissions((prev) => [result.data, ...prev]);
    } catch (error) {
      console.error("Failed to add submission:", error)
      throw error // Re-throw to allow calling component to handle
    }
  }

  return (
    <WasteDataContext.Provider value={{ submissions, addSubmission }}>
      {children}
    </WasteDataContext.Provider>
  )
}

export function useWasteData() {
  const context = useContext(WasteDataContext)
  if (context === undefined) {
    throw new Error("useWasteData must be used within a WasteDataProvider")
  }
  return context
}
