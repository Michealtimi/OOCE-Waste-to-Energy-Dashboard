"use client"

import { useMemo } from "react"
// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Data Context
import { useWasteData } from "@/context/waste-data-context"

// Recharts Components needed for the core chart structure
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts" 

// Shadcn Chart Wrappers and Configuration
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Define the shape of the data point
interface ChartDataPoint {
  lga: string;
  tons: number;
  fill: string;
}

// 1. Define the Chart Configuration
const chartConfig = {
  tons: {
    label: "Tonnage (tons)",
    // Use the color from the original file
    color: "hsl(var(--chart-2))", 
  },
} satisfies ChartConfig

export function LgaBarChart() {
  const { submissions } = useWasteData()
  
  const chartData: ChartDataPoint[] = useMemo(() => {
    // Function to interpolate between two HSL colors
    // Green (hsl(140, 70%, 50%)) to Yellow (hsl(48, 90%, 50%))
    const getColorForRank = (rank: number, maxRank: number) => {
      const startHue = 140 // Green
      const endHue = 48   // Yellow
      const startLightness = 50
      const endLightness = 50

      // Calculate the ratio (0 for rank 0, 1 for maxRank)
      const ratio = rank / Math.max(1, maxRank - 1)

      const hue = startHue + ratio * (endHue - startHue)
      const lightness = startLightness + ratio * (endLightness - startLightness)

      return `hsl(${hue}, 70%, ${lightness}%)`
    }

    const today = new Date().toISOString().split("T")[0]
    const lgaTotals: { [key: string]: number } = {}

    submissions
      .filter(s => s.date === today)
      .forEach(submission => {
        lgaTotals[submission.lga] = (lgaTotals[submission.lga] || 0) + submission.tons
      })
    
    const sortedLgas = Object.entries(lgaTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    return sortedLgas
      .map(([lga, tons], index) => ({ 
        lga, 
        tons: Math.round(tons * 10) / 10,
        fill: getColorForRank(index, sortedLgas.length)
      }))
  }, [submissions])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg text-primary">
          {"Today's Top 10 LGAs by Tonnage"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 3. Implement the shadcn/ui Chart Component */}
        {/* ChartContainer replaces ResponsiveContainer and sets the fixed height via Tailwind class */}
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart 
            accessibilityLayer
            data={chartData} 
            layout="vertical"
            // Re-adding margins for proper spacing
            margin={{ top: 5, right: 20, left: 80, bottom: 5 }} 
          >
            {/* CartesianGrid uses shadcn styling via CSS vars */}
            <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
            
            {/* XAxis (Tonnage Value) - Styling is now simplified and handled by ChartContainer */}
            <XAxis 
              type="number"
              dataKey="tons"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}t`} 
            />
            
            {/* YAxis (LGA Names - Category) - Styling is now simplified and handled by ChartContainer */}
            <YAxis 
              type="category"
              dataKey="lga"
              tickLine={false}
              axisLine={false}
              className="text-xs"
              width={75} // Ensure enough width for LGA names
            />
            
            {/* Tooltip uses shadcn wrapper for unified styling and keeps your custom formatter logic */}
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                    // Set the tooltip to hide the default label (the LGA name is better shown as the value)
                    hideLabel
                    // Use a custom formatter to match your original display logic, ensuring value is treated as number
                    formatter={(value: any) => [`${(value as number).toFixed(1)} tons`, "Collected"]}
                />
              } 
            />
            
            {/* Bar Component - Fill color references ChartConfig */}
            <Bar 
              dataKey="tons" 
              fill="var(--color-fill)" // Use the fill from the data
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}