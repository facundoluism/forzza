import { colors, radius } from "../tokens";

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = radius.sm }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
        backgroundColor: colors.gray800,
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}
