"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Sample data for Top 10 LGAs
const topLgasData = [
  { name: "Ikeja", tonnage: 1200 },
  { name: "Alimosho", tonnage: 1100 },
  { name: "Surulere", tonnage: 980 },
  { name: "Kosofe", tonnage: 900 },
  { name: "Lagos Island", tonnage: 850 },
  { name: "Apapa", tonnage: 780 },
  { name: "Eti-Osa", tonnage: 720 },
  { name: "Ikorodu", tonnage: 650 },
  { name: "Ojo", tonnage: 600 },
  { name: "Mushin", tonnage: 550 },
].sort((a, b) => a.tonnage - b.tonnage); // Sort for horizontal chart

export function TopLgasChart() {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topLgasData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Bar dataKey="tonnage" fill="#adfa1d" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}