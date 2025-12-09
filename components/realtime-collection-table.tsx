"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useWasteData, LGAS, PSP_OPERATORS, WASTE_TYPES } from "@/context/waste-data-context"
import { Activity, Truck, Clock, Zap } from "lucide-react"

interface LiveEntry {
  id: string
  time: string
  lga: string
  pspOperator: string
  tons: number
  wasteType: string
  status: "collecting" | "in-transit" | "delivered"
}

export function RealtimeCollectionTable() {
  const { submissions, addSubmission } = useWasteData()
  const [liveEntries, setLiveEntries] = useState<LiveEntry[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Generate initial live entries
  useEffect(() => {
    const generateLiveEntries = (): LiveEntry[] => {
      const statuses: LiveEntry["status"][] = ["collecting", "in-transit", "delivered"]
      return Array.from({ length: 8 }, (_, i) => {
        const now = new Date()
        now.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60))
        return {
          id: `live-${i}`,
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          lga: LGAS[Math.floor(Math.random() * LGAS.length)],
          pspOperator: PSP_OPERATORS[Math.floor(Math.random() * PSP_OPERATORS.length)],
          tons: Math.round((Math.random() * 15 + 5) * 10) / 10,
          wasteType: WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
        }
      })
    }
    setLiveEntries(generateLiveEntries())
    setLastUpdate(new Date())
    setIsMounted(true)
  }, [])

  // Simulate real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEntries((prev) => {
        const updated = [...prev]
        // Randomly update 1-2 entries
        const updateCount = Math.floor(Math.random() * 2) + 1
        for (let i = 0; i < updateCount; i++) {
          const idx = Math.floor(Math.random() * updated.length)
          const statuses: LiveEntry["status"][] = ["collecting", "in-transit", "delivered"]
          const currentStatusIdx = statuses.indexOf(updated[idx].status)
          // Progress status forward or reset
          updated[idx] = {
            ...updated[idx],
            status: currentStatusIdx < 2 ? statuses[currentStatusIdx + 1] : "collecting",
            tons:
              updated[idx].status === "delivered" ? Math.round((Math.random() * 15 + 5) * 10) / 10 : updated[idx].tons,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          }

          // If a truck just "delivered", add it to the main submissions data
          if (updated[idx].status === "delivered") {
            addSubmission({
              pspOperator: updated[idx].pspOperator,
              lga: updated[idx].lga,
              wasteType: updated[idx].wasteType,
              tons: updated[idx].tons,
              date: new Date().toISOString().split("T")[0],
            })
          }
        }
        return updated
      })
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [addSubmission, isMounted]) // Depend on isMounted to ensure interval starts on client

  const getStatusBadge = (status: LiveEntry["status"]) => {
    switch (status) {
      case "collecting":
        return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">Collecting</Badge>
      case "in-transit":
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">In Transit</Badge>
      case "delivered":
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Delivered</Badge>
    }
  }

  const totalTonsToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    return submissions.filter((s) => s.date === today).reduce((acc, s) => acc + s.tons, 0)
  }, [submissions])

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            <CardTitle className="font-serif text-lg text-primary">Real-Time Collection Activity</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
            <span>|</span>
            {isMounted && lastUpdate && (
              <>
                <Clock className="w-3 h-3" />
                <span>Updated {lastUpdate.toLocaleTimeString()}</span>
              </>
            )}
          </div>
        </div>
        <CardDescription className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            {liveEntries.filter((e) => e.status !== "delivered").length} active trucks
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-accent" />
            {totalTonsToday.toFixed(1)} tons collected today
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-muted-foreground font-semibold">Time</TableHead>
                <TableHead className="text-muted-foreground font-semibold">LGA</TableHead>
                <TableHead className="text-muted-foreground font-semibold">PSP Operator</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">Tonnage</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Waste Type</TableHead>
                <TableHead className="text-muted-foreground font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveEntries.map((entry) => (
                <TableRow key={entry.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm">{entry.time}</TableCell>
                  <TableCell className="font-medium text-primary">{entry.lga}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.pspOperator}</TableCell>
                  <TableCell className="text-right font-semibold text-accent">{entry.tons}t</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.wasteType}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
