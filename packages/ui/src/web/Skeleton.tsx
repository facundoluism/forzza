import { colors, radius } from "../tokens";

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

// Shimmer suave de opacity (loop). El easing sale de var(--ease-out).
// Reduced-motion: el @media global de globals.css neutraliza animation-duration,
// dejando la opacity fija — no hace falta lógica extra acá.
const SKELETON_KEYFRAMES = `
@keyframes ui-skeleton-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}`;

export function Skeleton({ width = "100%", height = 16, borderRadius = radius.sm }: SkeletonProps) {
  return (
    <>
      <style>{SKELETON_KEYFRAMES}</style>
      <div
        style={{
          width,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
          backgroundColor: colors.gray800,
          animation: "ui-skeleton-pulse 1.5s var(--ease-out) infinite",
          willChange: "opacity",
        }}
      />
    </>
  );
}
