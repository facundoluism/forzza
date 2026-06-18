// ExerciseIcon — native (react-native-svg)
// Renderiza usando Svg/Rect/Circle/Ellipse/Path de react-native-svg,
// con las MISMAS coordenadas y viewBox (0 0 80 80) que el componente web.
// La geometría proviene de exerciseIconGeometry.ts (fuente compartida).
//
// SYNC: si modificás coordenadas en exerciseIconGeometry.ts o en web/ExerciseIcon.tsx,
// ambas plataformas quedan sincronizadas automáticamente (native lee el módulo compartido;
// web tiene las coordenadas embebidas — mantenerlas en sync manualmente hasta que
// web también migre al módulo compartido).
//
// Nota de device: para ver los íconos SVG en el dispositivo se requiere un
// nuevo dev-build (EAS Build o `expo run:ios` / `expo run:android`) porque
// react-native-svg es una dependencia nativa.

import Svg, {
  Rect,
  Circle,
  Ellipse,
  Path,
} from "react-native-svg";

import { colors } from "../tokens";
import type { ExerciseIconProps, ExerciseIconKey } from "../exerciseIconTypes";
import {
  EXERCISE_ICON_GEOMETRY,
  ACCENT_SENTINEL,
  type Shape,
} from "../exerciseIconGeometry";

// ---------------------------------------------------------------------------
// Resolver de color: reemplaza el sentinel AC con el color de acento real
// ---------------------------------------------------------------------------
function resolveColor(value: string, accentColor: string): string {
  return value === ACCENT_SENTINEL ? accentColor : value;
}

// ---------------------------------------------------------------------------
// Renderer de una forma individual
// ---------------------------------------------------------------------------
function renderShape(shape: Shape, accentColor: string, index: number) {
  switch (shape.type) {
    case "rect":
      return (
        <Rect
          key={index}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx ?? 0}
          fill={resolveColor(shape.fill, accentColor)}
          opacity={shape.opacity ?? 1}
          transform={shape.transform}
        />
      );

    case "circle": {
      const circleProps = {
        cx: shape.cx,
        cy: shape.cy,
        r: shape.r,
        fill: resolveColor(shape.fill, accentColor),
        opacity: shape.opacity ?? 1,
        ...(shape.stroke !== undefined && {
          stroke: resolveColor(shape.stroke, accentColor),
        }),
        ...(shape.strokeWidth !== undefined && {
          strokeWidth: shape.strokeWidth,
        }),
      };
      return <Circle key={index} {...circleProps} />;
    }

    case "ellipse":
      return (
        <Ellipse
          key={index}
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          fill={resolveColor(shape.fill, accentColor)}
          opacity={shape.opacity ?? 1}
        />
      );

    case "path": {
      const pathProps = {
        d: shape.d,
        stroke: resolveColor(shape.stroke, accentColor),
        strokeWidth: shape.strokeWidth,
        strokeLinecap: shape.strokeLinecap ?? "round" as const,
        strokeLinejoin: shape.strokeLinejoin ?? "miter" as const,
        fill: shape.fill ?? "none",
        opacity: shape.opacity ?? 1,
        ...(shape.strokeDasharray !== undefined && {
          strokeDasharray: shape.strokeDasharray,
        }),
      };
      return <Path key={index} {...pathProps} />;
    }
  }
}

// ---------------------------------------------------------------------------
// Componente público — API idéntica al web
// ---------------------------------------------------------------------------

export type { ExerciseIconProps, ExerciseIconKey };

export function ExerciseIcon({
  icon,
  size = 40,
  color = colors.lime,
}: ExerciseIconProps) {
  const key: ExerciseIconKey =
    icon in EXERCISE_ICON_GEOMETRY
      ? (icon as ExerciseIconKey)
      : "machine-generic";

  const shapes = EXERCISE_ICON_GEOMETRY[key];

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
    >
      {shapes.map((shape, i) => renderShape(shape, color, i))}
    </Svg>
  );
}
