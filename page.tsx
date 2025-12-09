"use client"

import { useMemo } from "react"
import { useWasteData } from "@/context/waste-data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WasteTrendChart } from "@/components/waste-trend-chart"
import { TopLgasChart } from "@/components/top-lgas-chart"

export default function DashboardPage() {
  const { submissions } = useWasteData()

  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split("T")[0]

    const todaySubmissions = submissions.filter((s) => s && s.date === today)
    const weekSubmissions = submissions.filter((s) => s && s.date >= weekAgoStr)

    const todayTons = todaySubmissions.reduce((sum, s) => sum + s.tons, 0)
    const weekTons = weekSubmissions.reduce((sum, s) => sum + s.tons, 0)

    return {
      todayTons: Math.round(todayTons * 10) / 10,
      weekTons: Math.round(weekTons * 10) / 10,
      todayEnergy: Math.round(todayTons * 650),
      weekEnergy: Math.round(weekTons * 650),
    }
  }, [submissions])

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Waste to Energy Analytics</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Tonnage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.todayTons} Tons</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Generated (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.todayEnergy.toLocaleString()} kWh</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WasteTrendChart />
          <TopLgasChart />
        </div>
      </div>
    </main>
  )
}