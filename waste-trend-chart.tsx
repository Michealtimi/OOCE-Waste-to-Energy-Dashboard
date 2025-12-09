"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data for the last 14 days
const trendData = [
  { date: "Day 1", tonnage: 400 },
  { date: "Day 2", tonnage: 300 },
  { date: "Day 3", tonnage: 350 },
  { date: "Day 4", tonnage: 500 },
  { date: "Day 5", tonnage: 450 },
  { date: "Day 6", tonnage: 600 },
  { date: "Day 7", tonnage: 550 },
  { date: "Day 8", tonnage: 650 },
  { date: "Day 9", tonnage: 700 },
  { date: "Day 10", tonnage: 680 },
  { date: "Day 11", tonnage: 720 },
  { date: "Day 12", tonnage: 750 },
  { date: "Day 13", tonnage: 710 },
  { date: "Day 14", tonnage: 800 },
];

export function WasteTrendChart() {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} T`} />
          <Tooltip />
          <Area type="monotone" dataKey="tonnage" stroke="#adfa1d" fill="#adfa1d" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}