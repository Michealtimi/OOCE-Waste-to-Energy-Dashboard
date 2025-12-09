"use client"

import { Navbar } from "@/components/navbar"
// import { MetricCard } from "@/components/metric-card" // MetricCard is not used in the provided page.tsx, commenting out for now
import { WasteTrendChart } from "@/components/waste-trend-chart"
import { TopLgasChart } from "@/components/top-lgas-chart" // Corrected import
// import { RealtimeCollectionTable } from "@/components/realtime-collection-table" // Not provided in context
// import { LgaTonnageTable } from "@/components/lga-tonnage-table" // Not provided in context
import { useWasteData } from "@/context/waste-data-context"
import { useMemo } from "react"
import { Truck, Calendar, Zap, Leaf } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { RealtimeCollectionTable } from "@/components/realtime-collection-table"
import { LgaTonnageTable } from "@/components/lga-tonnage-table"

export default function DashboardPage() {
  const { submissions } = useWasteData()

  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split("T")[0]

    const todaySubmissions = submissions.filter((s) => s.date === today)
    const weekSubmissions = submissions.filter((s) => s.date >= weekAgoStr)

    const todayTons = todaySubmissions.reduce((sum, s) => sum + s.tons, 0)
    const weekTons = weekSubmissions.reduce((sum, s) => sum + s.tons, 0)
    const totalEnergy = submissions.reduce((sum, s) => sum + s.energyKWh, 0)
    const totalCredits = submissions.reduce((sum, s) => sum + s.carbonCredits, 0)

    return {
      todayTons: Math.round(todayTons * 10) / 10,
      weekTons: Math.round(weekTons * 10) / 10,
      totalEnergy: Math.round(totalEnergy),
      totalCredits: Math.round(totalCredits * 100) / 100,
    }
  }, [submissions])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary">Waste-to-Energy Dashboard</h1>
          <p className="text-muted-foreground mt-1">Office of Climate Change & Circular Economy (OCCE) — Lagos State</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard title="Total Tons Today" value={metrics.todayTons} subtitle="tons collected" icon={Truck} />
          <MetricCard title="Weekly Total" value={metrics.weekTons} subtitle="tons this week" icon={Calendar} />
          <MetricCard
            title="Energy Generated"
            value={`${metrics.totalEnergy.toLocaleString()} kWh`}
            subtitle="total conversion"
            icon={Zap}
            variant="accent"
          />
          <MetricCard
            title="Carbon Credits"
            value={metrics.totalCredits.toFixed(2)}
            subtitle="credits earned"
            icon={Leaf}
            variant="accent"
          />
        </div>

        <div className="mb-8">
          <RealtimeCollectionTable />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <WasteTrendChart />
          <TopLgasChart />
        </div>

        <LgaTonnageTable />
      </main>
    </div>
  )
}
