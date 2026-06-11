import type { CSSProperties } from "react";
import { colors } from "../tokens";

export interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  style?: CSSProperties;
}

function buildPoints(data: number[], w: number, h: number, pad: number): string {
  if (data.length === 0) return "";
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return data
    .map((v, i) => {
      const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

export function LineChart({
  data,
  width = 200,
  height = 60,
  color = colors.lime,
  showDots = false,
  style,
}: LineChartProps) {
  const pad = 4;
  const points = buildPoints(data, width, height, pad);

  if (data.length < 2) {
    return <div style={{ width, height, ...style }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const dotPoints = data.map((v, i) => ({
    cx: pad + (i / Math.max(data.length - 1, 1)) * (width - pad * 2),
    cy: pad + (1 - (v - min) / range) * (height - pad * 2),
  }));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", ...style }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDots &&
        dotPoints.map((pt, i) => (
          <circle key={i} cx={pt.cx} cy={pt.cy} r={3} fill={color} />
        ))}
    </svg>
  );
}
