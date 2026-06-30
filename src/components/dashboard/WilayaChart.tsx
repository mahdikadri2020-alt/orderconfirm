"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface WilayaChartProps {
  data: { name: string; confirmed: number; cancelled: number }[];
}

export function WilayaChart({ data }: WilayaChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--foreground)",
            }}
          />
          <Bar dataKey="confirmed" fill="#25D366" radius={[0, 4, 4, 0]} name="Confirmées" />
          <Bar dataKey="cancelled" fill="#ef4444" radius={[0, 4, 4, 0]} name="Annulées" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
