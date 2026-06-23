"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#A5B4FC", "#C7D2FE", "#DDD6FE"];

export default function GraficoBarras({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={{ stroke: "#475569" }} />
        <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #475569",
            backgroundColor: "#1E293B",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            fontSize: "13px",
            color: "#F1F5F9",
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
