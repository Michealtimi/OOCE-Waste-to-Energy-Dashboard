"use client";

import {
  Area,
  AreaChart,
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

interface WasteTrendChartProps {
  lgaFilter?: string;
}

export function WasteTrendChart({ lgaFilter }: WasteTrendChartProps) {
  const { submissions } = useWasteData();
  const chartData = useMemo(() => {
    const today = new Date();
    const last14Days: { [key: string]: number } = {};

    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last14Days[dateStr] = 0;
    }

    const filtered = lgaFilter
      ? submissions.filter((s) => s.lga === lgaFilter)
      : submissions;

    filtered.forEach((submission) => {
      if (last14Days.hasOwnProperty(submission.date)) {
        last14Days[submission.date] += submission.tons;
      }
    });

    return Object.entries(last14Days).map(([date, tons]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      tons: Math.round(tons * 10) / 10,
    }));
  }, [submissions, lgaFilter]);

  const chartConfig = {
    tons: {
      label: "Tons",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg text-primary">
          {lgaFilter ? `${lgaFilter} - ` : ""}14-Day Waste Collection Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}t`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <defs>
                <linearGradient id="fillTons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tons)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-tons)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area dataKey="tons" type="monotone" fill="url(#fillTons)" stroke="var(--color-tons)" stackId="a" />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}