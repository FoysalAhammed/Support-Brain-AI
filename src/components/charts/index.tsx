"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TrendPoint } from "@/types/common";
import type { NamedValue } from "@/types/analytics";

export const chartPalette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function buildPath(
  values: number[],
  width: number,
  height: number,
  padding: number,
  max: number,
) {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : innerW;
  return values.map((value, index) => {
    const x = padding + index * step;
    const y = padding + innerH - (value / max) * innerH;
    return { x, y };
  });
}

function smooth(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export function Sparkline({
  values,
  className,
  color = "var(--chart-1)",
  positive = true,
}: {
  values: number[];
  className?: string;
  color?: string;
  positive?: boolean;
}) {
  const width = 96;
  const height = 30;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values.map((value, index) => ({
    x: (index / Math.max(values.length - 1, 1)) * width,
    y: height - ((value - min) / range) * (height - 4) - 2,
  }));
  const stroke = positive ? color : "var(--destructive)";
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-8 w-24 overflow-visible", className)}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={smooth(points)}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AreaChart({
  data,
  height = 220,
  color = "var(--chart-1)",
  secondaryColor = "var(--chart-2)",
  showSecondary = false,
  valueSuffix = "",
  className,
}: {
  data: TrendPoint[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  showSecondary?: boolean;
  valueSuffix?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState<number | null>(null);
  const width = 720;
  const padding = 24;
  const values = data.map((d) => d.value);
  const previous = data.map((d) => d.previous ?? 0);
  const max = Math.max(...values, ...(showSecondary ? previous : [0]), 1) * 1.15;

  const points = buildPath(values, width, height, padding, max);
  const prevPoints = buildPath(previous, width, height, padding, max);
  const linePath = smooth(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  const gradientId = React.useId();

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
        onMouseLeave={() => setActive(null)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - rect.left) / rect.width;
          const index = Math.round(ratio * (data.length - 1));
          setActive(Math.min(Math.max(index, 0), data.length - 1));
        }}
        style={{ height }}
        role="img"
        aria-label="Trend chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <line
            key={tick}
            x1={padding}
            x2={width - padding}
            y1={padding + (height - padding * 2) * tick}
            y2={padding + (height - padding * 2) * tick}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        ))}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        {showSecondary && (
          <path
            d={smooth(prevPoints)}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={2}
            strokeDasharray="5 5"
            opacity={0.55}
          />
        )}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {active !== null && (
          <>
            <line
              x1={points[active].x}
              x2={points[active].x}
              y1={padding}
              y2={height - padding}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <circle
              cx={points[active].x}
              cy={points[active].y}
              r={5}
              fill="var(--card)"
              stroke={color}
              strokeWidth={2.5}
            />
          </>
        )}
      </svg>
      <div className="mt-2 flex justify-between px-1 text-[0.7rem] font-medium text-muted-foreground">
        {data.map((point, index) => (
          <span
            key={`${point.label}-${index}`}
            className={cn(
              "tabular-nums transition-colors",
              active === index && "font-semibold text-foreground",
            )}
          >
            {active === index
              ? `${point.value}${valueSuffix}`
              : point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BarChart({
  data,
  height = 200,
  color = "var(--chart-1)",
  className,
}: {
  data: TrendPoint[];
  height?: number;
  color?: string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((point) => (
          <div key={point.label} className="group flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-semibold tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {point.value}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
              style={{
                height: `${Math.max((point.value / max) * 100, 3)}%`,
                background: `linear-gradient(180deg, ${color}, ${color}99)`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((point) => (
          <span
            key={point.label}
            className="flex-1 text-center text-[0.7rem] font-medium text-muted-foreground"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  data,
  size = 180,
  thickness = 18,
  centerLabel,
  centerValue,
  className,
}: {
  data: NamedValue[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label="Distribution chart">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={thickness}
        />
        {data.map((item, index) => {
          const fraction = item.value / total;
          const dash = fraction * circumference;
          const element = (
            <circle
              key={item.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color ?? chartPalette[index % chartPalette.length]}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return element;
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-semibold tabular-nums">{centerValue}</span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

export function Legend({
  data,
  className,
  suffix = "",
}: {
  data: NamedValue[];
  className?: string;
  suffix?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  return (
    <ul className={cn("space-y-2.5", className)}>
      {data.map((item, index) => (
        <li key={item.name} className="flex items-center gap-2.5 text-sm">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: item.color ?? chartPalette[index % chartPalette.length] }}
          />
          <span className="flex-1 truncate text-muted-foreground">{item.name}</span>
          <span className="font-medium tabular-nums">{item.value}{suffix}</span>
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
            {Math.round((item.value / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export function HorizontalBars({
  data,
  className,
  color = "var(--chart-1)",
  suffix = "",
}: {
  data: NamedValue[];
  className?: string;
  color?: string;
  suffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className={cn("space-y-3.5", className)}>
      {data.map((item, index) => (
        <li key={item.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-muted-foreground">{item.name}</span>
            <span className="font-medium tabular-nums">
              {item.value}
              {suffix}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color ?? color,
                opacity: 1 - index * 0.06,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
