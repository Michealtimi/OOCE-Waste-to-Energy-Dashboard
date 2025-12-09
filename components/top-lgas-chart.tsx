"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWasteData } from "@/context/waste-data-context";
import { useMemo } from "react";

export function TopLgasChart() {
  const { submissions } = useWasteData();

  const chartData = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lgaTonnage: { [lga: string]: number } = {};

    submissions.forEach((s) => {
      if (s.date === todayStr) {
        lgaTonnage[s.lga] = (lgaTonnage[s.lga] || 0) + s.tons;
      }
    });

    return Object.entries(lgaTonnage)
      .map(([lga, tonnage]) => ({ lga, tonnage: Math.round(tonnage * 10) / 10 }))
      .sort((a, b) => b.tonnage - a.tonnage) // Sort descending for top LGAs
      .slice(0, 10); // Take top 10
  }, [submissions]);

  const chartConfig = {
    tonnage: {
      label: "Tonnage",
      color: "hsl(var(--chart-2))", // Assuming --chart-2 is defined in your CSS
    },
  } satisfies ChartConfig;
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg text-primary">
          Today's Top 10 LGAs by Tonnage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid horizontal={false} /> {/* Horizontal grid for vertical bars */}
              <XAxis type="number" hide /> {/* Hide X-axis as Y-axis shows values */}
              <YAxis
                type="category"
                dataKey="lga"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="tonnage" fill="var(--color-tonnage)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}