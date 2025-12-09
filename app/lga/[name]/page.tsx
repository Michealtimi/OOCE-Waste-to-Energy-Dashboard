"use client"

import { use, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { MetricCard } from "@/components/metric-card"
import { WasteTrendChart } from "@/components/waste-trend-chart"
import { SubmissionsTable } from "@/components/submissions-table"
import { useWasteData, LGAS } from "@/context/waste-data-context"
import { Truck, Zap, Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface LgaPageProps {
  params: Promise<{ name: string }>
}

export default function LgaPage({ params }: LgaPageProps) {
  const resolvedParams = use(params)
  const decodedName = decodeURIComponent(resolvedParams.name)
  const { submissions } = useWasteData()

  const isValidLga = LGAS.includes(decodedName)

  const metrics = useMemo(() => {
    if (!isValidLga) return { totalTons: 0, totalEnergy: 0, totalCredits: 0 }

    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)
    const monthAgoStr = monthAgo.toISOString().split("T")[0]

    const lgaSubmissions = submissions.filter((s) => s.lga === decodedName && s.date >= monthAgoStr)

    const totalTons = lgaSubmissions.reduce((sum, s) => sum + s.tons, 0)
    const totalEnergy = lgaSubmissions.reduce((sum, s) => sum + s.energyKWh, 0)
    const totalCredits = lgaSubmissions.reduce((sum, s) => sum + s.carbonCredits, 0)

    return {
      totalTons: Math.round(totalTons * 10) / 10,
      totalEnergy: Math.round(totalEnergy),
      totalCredits: Math.round(totalCredits * 100) / 100,
    }
  }, [submissions, decodedName, isValidLga])

  if (!isValidLga) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center py-16">
            <h1 className="font-serif text-3xl font-bold text-primary mb-4">LGA Not Found</h1>
            <p className="text-muted-foreground">The LGA "{decodedName}" was not found in our records.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-primary">{decodedName} LGA</h1>
          <p className="text-muted-foreground mt-1">Waste collection and energy conversion data for {decodedName}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <MetricCard title="Monthly Tons" value={metrics.totalTons} subtitle="tons this month" icon={Truck} />
          <MetricCard
            title="Energy Generated"
            value={`${metrics.totalEnergy.toLocaleString()} kWh`}
            subtitle="monthly conversion"
            icon={Zap}
            variant="accent"
          />
          <MetricCard
            title="Carbon Credits"
            value={metrics.totalCredits.toFixed(2)}
            subtitle="credits this month"
            icon={Leaf}
            variant="accent"
          />
        </div>

        <div className="grid gap-6 mb-8">
          <WasteTrendChart lgaFilter={decodedName} />
        </div>

        <SubmissionsTable lgaFilter={decodedName} limit={50} />
      </main>
    </div>
  )
}
