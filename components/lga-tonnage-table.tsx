"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useWasteData, LGAS } from "@/context/waste-data-context"
import { MapPin, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react"

interface LgaStats {
  lga: string
  totalTons: number
  todayTons: number
  submissions: number
  trend: "up" | "down" | "stable"
  percentOfMax: number
}

export function LgaTonnageTable() {
  const { submissions } = useWasteData()

  const lgaStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    const stats: LgaStats[] = LGAS.map((lga) => {
      const lgaSubmissions = submissions.filter((s) => s.lga === lga)
      const totalTons = lgaSubmissions.reduce((acc, s) => acc + s.tons, 0)
      const todayTons = lgaSubmissions.filter((s) => s.date === today).reduce((acc, s) => acc + s.tons, 0)
      const yesterdayTons = lgaSubmissions.filter((s) => s.date === yesterday).reduce((acc, s) => acc + s.tons, 0)

      let trend: "up" | "down" | "stable" = "stable"
      if (todayTons > yesterdayTons * 1.1) trend = "up"
      else if (todayTons < yesterdayTons * 0.9) trend = "down"

      return {
        lga,
        totalTons: Math.round(totalTons * 10) / 10,
        todayTons: Math.round(todayTons * 10) / 10,
        submissions: lgaSubmissions.length,
        trend,
        percentOfMax: 0,
      }
    })

    const maxTons = Math.max(...stats.map((s) => s.totalTons), 1)
    stats.forEach((s) => {
      s.percentOfMax = (s.totalTons / maxTons) * 100
    })

    return stats.sort((a, b) => b.totalTons - a.totalTons)
  }, [submissions])

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-amber-500 text-white">1st</Badge>
    if (index === 1) return <Badge className="bg-gray-400 text-white">2nd</Badge>
    if (index === 2) return <Badge className="bg-amber-700 text-white">3rd</Badge>
    return <Badge variant="outline">{index + 1}th</Badge>
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <CardTitle className="font-serif text-lg text-primary">LGA Waste Collection Summary</CardTitle>
        </div>
        <CardDescription>All 20 Local Government Areas ranked by total tonnage collected</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-muted-foreground font-semibold w-16">Rank</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Local Government Area</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">Total (tons)</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">Today</TableHead>
                <TableHead className="text-muted-foreground font-semibold hidden md:table-cell">Progress</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-center">Trend</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">Records</TableHead>
                <TableHead className="text-muted-foreground font-semibold w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lgaStats.map((stat, index) => (
                <TableRow key={stat.lga} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell>{getRankBadge(index)}</TableCell>
                  <TableCell className="font-medium text-primary">{stat.lga}</TableCell>
                  <TableCell className="text-right font-semibold text-accent">{stat.totalTons}t</TableCell>
                  <TableCell className="text-right text-muted-foreground">{stat.todayTons}t</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={stat.percentOfMax} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground">{Math.round(stat.percentOfMax)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getTrendIcon(stat.trend)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{stat.submissions}</TableCell>
                  <TableCell>
                    <Link
                      href={`/lga/${encodeURIComponent(stat.lga)}`}
                      className="text-primary hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
