// ══════════════════════════════════════════════════════════════════════════════
// 📊 Componente: DonutChart — Gráfico de rosca interativo com Recharts
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DonutData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
  format?: "currency" | "number";
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 300,
  format = "currency",
}: DonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="transition-all duration-200 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1b1f",
              border: "1px solid #3e3f47",
              borderRadius: "12px",
              padding: "8px 12px",
              fontSize: "13px",
              color: "#fff",
            }}
            formatter={(value: number) => [
              format === "currency"
                ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : value.toLocaleString("pt-BR"),
              "",
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-dark-300 ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Centro */}
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <span className="text-2xl font-bold text-white">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-dark-400">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 📈 Componente: BarChartCustom — Gráfico de barras premium
// ══════════════════════════════════════════════════════════════════════════════

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface BarData {
  name: string;
  valor: number;
  meta?: number;
}

interface BarChartCustomProps {
  data: BarData[];
  height?: number;
  barColor?: string;
  metaColor?: string;
  format?: "currency" | "number" | "days";
}

export function BarChartCustom({
  data,
  height = 300,
  barColor = "#e14a72",
  metaColor = "#d99c22",
  format = "currency",
}: BarChartCustomProps) {
  const formatTick = (value: number) => {
    if (format === "number") return value.toLocaleString("pt-BR");
    if (format === "days") return `${value}d`;
    return `R$ ${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltip = (value: number) => {
    if (format === "number") return value.toLocaleString("pt-BR");
    if (format === "days") return `${value.toLocaleString("pt-BR")} dias`;
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2b30" />
        <XAxis
          dataKey="name"
          stroke="#7b7e87"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#7b7e87"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatTick}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1b1f",
            border: "1px solid #3e3f47",
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "13px",
            color: "#fff",
          }}
          formatter={(value: number) => [formatTooltip(value), ""]}
        />
        <Bar
          dataKey="valor"
          fill={barColor}
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
        {data.some((d) => d.meta) && (
          <Bar
            dataKey="meta"
            fill={metaColor}
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            opacity={0.4}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 📉 Componente: LineChartCustom — Gráfico de linha para evolução
// ══════════════════════════════════════════════════════════════════════════════

import {
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface LineData {
  label: string;
  [key: string]: string | number;
}

interface LineChartCustomProps {
  data: LineData[];
  lines: { key: string; color: string; label: string }[];
  height?: number;
  area?: boolean;
}

export function LineChartCustom({
  data,
  lines,
  height = 300,
  area = false,
}: LineChartCustomProps) {
  const Chart = area ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2b30" />
        <XAxis
          dataKey="label"
          stroke="#7b7e87"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#7b7e87"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1b1f",
            border: "1px solid #3e3f47",
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "13px",
            color: "#fff",
          }}
        />
        <Legend
          verticalAlign="top"
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-dark-300 ml-1">{value}</span>
          )}
        />
        {lines.map((line) =>
          area ? (
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              fill={line.color}
              fillOpacity={0.1}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ) : (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          )
        )}
      </Chart>
    </ResponsiveContainer>
  );
}
