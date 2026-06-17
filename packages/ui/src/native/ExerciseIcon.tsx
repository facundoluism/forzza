// ExerciseIcon — native (React Native View-based)
// Renderiza íconos geométricos usando View + StyleSheet sin react-native-svg.
// Misma API que el componente web: { icon, size, color }.
// Colores de estructura desde tokens.ts — cero hex sueltos.

import { View } from "react-native";
import { colors } from "../tokens";
import type { ExerciseIconProps, ExerciseIconKey } from "../exerciseIconTypes";

// Colores estructurales
const S3 = colors.surface3;
const S4 = colors.surface4;
const GL = colors.muted;

// ---------------------------------------------------------------------------
// Primitivos de dibujo (View-based, coordenadas normalizadas 0-1)
// Se escalan por "u" = size / 80 para mantener las mismas proporciones
// que el viewBox 0 0 80 80 del web.
// ---------------------------------------------------------------------------

interface BarProps {
  x: number; y: number; w: number; h: number; r?: number; color: string; opacity?: number; u: number;
}
function Bar({ x, y, w, h, r = 2, color, opacity = 1, u }: BarProps) {
  return (
    <View style={{
      position: "absolute",
      left: x * u, top: y * u,
      width: w * u, height: h * u,
      borderRadius: r * u,
      backgroundColor: color,
      opacity,
    }} />
  );
}

interface CircleProps {
  cx: number; cy: number; r: number; color: string; opacity?: number; u: number;
}
function Circ({ cx, cy, r, color, opacity = 1, u }: CircleProps) {
  return (
    <View style={{
      position: "absolute",
      left: (cx - r) * u, top: (cy - r) * u,
      width: r * 2 * u, height: r * 2 * u,
      borderRadius: r * u,
      backgroundColor: color,
      opacity,
    }} />
  );
}

// Línea entre dos puntos usando View rotado
interface LineProps {
  x1: number; y1: number; x2: number; y2: number;
  color: string; thickness?: number; opacity?: number; u: number;
}
function Line({ x1, y1, x2, y2, color, thickness = 4, opacity = 1, u }: LineProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return (
    <View style={{
      position: "absolute",
      left: x1 * u,
      top: (y1 - thickness / 2) * u,
      width: length * u,
      height: thickness * u,
      borderRadius: (thickness / 2) * u,
      backgroundColor: color,
      opacity,
      transform: [{ rotate: `${angle}deg` }],
      transformOrigin: `0 ${(thickness / 2) * u}px`,
    }} />
  );
}

// ---------------------------------------------------------------------------
// Renderer por key de ícono
// Cada función recibe (ac: string, u: number) y retorna JSX de Views.
// ---------------------------------------------------------------------------

type IconRenderer = (ac: string, u: number) => React.ReactElement;

const ICONS: Record<ExerciseIconKey, IconRenderer> = {
  // bench-press
  "bench-press": (ac, u) => (
    <>
      <Bar x={10} y={46} w={60} h={8} r={4} color={S3} u={u} />
      <Bar x={6} y={52} w={4} h={20} r={2} color={S3} u={u} />
      <Bar x={70} y={52} w={4} h={20} r={2} color={S3} u={u} />
      <Bar x={8} y={26} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={22} w={12} h={12} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={64} y={22} w={12} h={12} r={3} color={ac} opacity={0.55} u={u} />
      <Circ cx={40} cy={40} r={10} color={GL} opacity={0.55} u={u} />
      <Line x1={30} y1={40} x2={18} y2={28} color={GL} thickness={4} opacity={0.8} u={u} />
      <Line x1={50} y1={40} x2={62} y2={28} color={GL} thickness={4} opacity={0.8} u={u} />
      <Circ cx={40} cy={48} r={6} color={GL} opacity={0.65} u={u} />
    </>
  ),

  // incline-press
  "incline-press": (ac, u) => (
    <>
      <Bar x={8} y={22} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={18} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={65} y={18} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={6} y={54} w={4} h={18} r={2} color={S3} u={u} />
      <Bar x={68} y={44} w={4} h={18} r={2} color={S3} u={u} />
      <Circ cx={32} cy={44} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={32} y1={50} x2={28} y2={68} color={GL} thickness={4} opacity={0.6} u={u} />
      <Line x1={32} y1={38} x2={50} y2={26} color={GL} thickness={4.5} opacity={0.8} u={u} />
      <Line x1={32} y1={38} x2={14} y2={30} color={GL} thickness={4.5} opacity={0.8} u={u} />
    </>
  ),

  // decline-press
  "decline-press": (ac, u) => (
    <>
      <Bar x={8} y={28} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={24} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={65} y={24} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={6} y={44} w={4} h={22} r={2} color={S3} u={u} />
      <Bar x={70} y={38} w={4} h={22} r={2} color={S3} u={u} />
      <Circ cx={48} cy={42} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={48} y1={48} x2={52} y2={65} color={GL} thickness={4} opacity={0.6} u={u} />
      <Line x1={42} y1={42} x2={28} y2={34} color={GL} thickness={4.5} opacity={0.8} u={u} />
      <Line x1={54} y1={38} x2={62} y2={32} color={GL} thickness={4.5} opacity={0.8} u={u} />
    </>
  ),

  // overhead-press
  "overhead-press": (ac, u) => (
    <>
      <Bar x={8} y={16} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={12} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={65} y={12} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Circ cx={40} cy={30} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={33} y={38} w={14} h={16} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={33} y1={40} x2={14} y2={22} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={47} y1={40} x2={66} y2={22} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={36} y1={54} x2={32} y2={72} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={44} y1={54} x2={48} y2={72} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // chest-fly
  "chest-fly": (ac, u) => (
    <>
      <Bar x={30} y={46} w={20} h={8} r={4} color={S3} u={u} />
      <Bar x={30} y={52} w={4} h={20} r={2} color={S3} u={u} />
      <Bar x={46} y={52} w={4} h={20} r={2} color={S3} u={u} />
      <Bar x={4} y={30} w={14} h={6} r={3} color={ac} opacity={0.85} u={u} />
      <Bar x={62} y={30} w={14} h={6} r={3} color={ac} opacity={0.85} u={u} />
      <Circ cx={40} cy={40} r={7} color={GL} opacity={0.65} u={u} />
      <Line x1={33} y1={40} x2={14} y2={33} color={GL} thickness={4} opacity={0.8} u={u} />
      <Line x1={47} y1={40} x2={66} y2={33} color={GL} thickness={4} opacity={0.8} u={u} />
    </>
  ),

  // pulldown
  "pulldown": (ac, u) => (
    <>
      <Bar x={20} y={8} w={40} h={5} r={2.5} color={S4} u={u} />
      <Bar x={38} y={13} w={4} h={10} r={2} color={S4} u={u} />
      <Bar x={16} y={23} w={48} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Circ cx={40} cy={36} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={33} y={44} w={14} h={14} r={4} color={GL} opacity={0.65} u={u} />
      <Line x1={33} y1={40} x2={22} y2={26} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={47} y1={40} x2={58} y2={26} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={37} y1={58} x2={28} y2={72} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={43} y1={58} x2={52} y2={72} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // pullup
  "pullup": (ac, u) => (
    <>
      <Bar x={10} y={10} w={60} h={6} r={3} color={ac} opacity={0.9} u={u} />
      <Bar x={10} y={6} w={4} h={14} r={2} color={S4} u={u} />
      <Bar x={66} y={6} w={4} h={14} r={2} color={S4} u={u} />
      <Circ cx={40} cy={26} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={33} y={34} w={14} h={16} r={5} color={GL} opacity={0.65} u={u} />
      <Line x1={33} y1={30} x2={26} y2={16} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={47} y1={30} x2={54} y2={16} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={37} y1={50} x2={34} y2={70} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={43} y1={50} x2={46} y2={70} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // row
  "row": (ac, u) => (
    <>
      <Bar x={62} y={10} w={10} h={60} r={4} color={S3} u={u} />
      <Circ cx={67} cy={24} r={5} color={ac} opacity={0.85} u={u} />
      <Circ cx={26} cy={22} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={20} y={30} w={12} h={18} r={5} color={GL} opacity={0.65} u={u} />
      <Line x1={30} y1={34} x2={36} y2={30} color={GL} thickness={4} opacity={0.85} u={u} />
      <Line x1={30} y1={38} x2={36} y2={38} color={GL} thickness={4} opacity={0.85} u={u} />
      <Line x1={22} y1={48} x2={18} y2={68} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={30} y1={48} x2={32} y2={68} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // deadlift
  "deadlift": (ac, u) => (
    <>
      <Bar x={8} y={62} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={55} w={12} h={16} r={4} color={ac} opacity={0.55} u={u} />
      <Bar x={64} y={55} w={12} h={16} r={4} color={ac} opacity={0.55} u={u} />
      <Circ cx={40} cy={20} r={7} color={GL} opacity={0.75} u={u} />
      <Line x1={40} y1={27} x2={40} y2={50} color={GL} thickness={6} opacity={0.65} u={u} />
      <Line x1={37} y1={42} x2={20} y2={62} color={GL} thickness={4.5} opacity={0.8} u={u} />
      <Line x1={43} y1={42} x2={60} y2={62} color={GL} thickness={4.5} opacity={0.8} u={u} />
      <Line x1={37} y1={50} x2={30} y2={66} color={GL} thickness={5} opacity={0.7} u={u} />
      <Line x1={43} y1={50} x2={50} y2={66} color={GL} thickness={5} opacity={0.7} u={u} />
    </>
  ),

  // squat
  "squat": (ac, u) => (
    <>
      <Bar x={8} y={24} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={20} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={65} y={20} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Circ cx={40} cy={18} r={7} color={GL} opacity={0.75} u={u} />
      <Line x1={40} y1={25} x2={38} y2={48} color={GL} thickness={6} opacity={0.65} u={u} />
      <Line x1={38} y1={32} x2={22} y2={30} color={GL} thickness={4} opacity={0.8} u={u} />
      <Line x1={42} y1={32} x2={58} y2={30} color={GL} thickness={4} opacity={0.8} u={u} />
      <Line x1={35} y1={48} x2={22} y2={62} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={41} y1={48} x2={54} y2={62} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={22} y1={62} x2={24} y2={76} color={GL} thickness={4.5} opacity={0.7} u={u} />
      <Line x1={54} y1={62} x2={52} y2={76} color={GL} thickness={4.5} opacity={0.7} u={u} />
    </>
  ),

  // lunge
  "lunge": (ac, u) => (
    <>
      <Bar x={4} y={40} w={14} h={6} r={3} color={ac} opacity={0.85} u={u} />
      <Bar x={62} y={40} w={14} h={6} r={3} color={ac} opacity={0.85} u={u} />
      <Circ cx={40} cy={16} r={7} color={GL} opacity={0.75} u={u} />
      <Line x1={40} y1={23} x2={40} y2={44} color={GL} thickness={6} opacity={0.65} u={u} />
      <Line x1={37} y1={34} x2={18} y2={42} color={GL} thickness={4} opacity={0.8} u={u} />
      <Line x1={43} y1={34} x2={62} y2={42} color={GL} thickness={4} opacity={0.8} u={u} />
      <Line x1={37} y1={44} x2={26} y2={60} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={26} y1={60} x2={28} y2={76} color={GL} thickness={4.5} opacity={0.7} u={u} />
      <Line x1={43} y1={44} x2={56} y2={58} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={56} y1={58} x2={58} y2={74} color={GL} thickness={4.5} opacity={0.7} u={u} />
    </>
  ),

  // leg-extension
  "leg-extension": (ac, u) => (
    <>
      <Bar x={10} y={38} w={40} h={8} r={4} color={S3} u={u} />
      <Bar x={10} y={46} w={8} h={28} r={4} color={S3} u={u} />
      <Bar x={42} y={46} w={8} h={28} r={4} color={S3} u={u} />
      <Bar x={48} y={20} w={8} h={26} r={4} color={S3} u={u} />
      <Circ cx={30} cy={32} r={9} color={GL} opacity={0.55} u={u} />
      <Circ cx={30} cy={22} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={22} y1={40} x2={55} y2={52} color={GL} thickness={5} opacity={0.8} u={u} />
      <Bar x={52} y={47} w={14} h={10} r={3} color={ac} opacity={0.85} u={u} />
    </>
  ),

  // leg-curl
  "leg-curl": (ac, u) => (
    <>
      <Bar x={10} y={30} w={60} h={8} r={4} color={S3} u={u} />
      <Bar x={10} y={38} w={8} h={30} r={4} color={S3} u={u} />
      <Bar x={62} y={38} w={8} h={30} r={4} color={S3} u={u} />
      <Bar x={22} y={22} w={36} h={14} r={6} color={GL} opacity={0.65} u={u} />
      <Circ cx={22} cy={22} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={52} y1={28} x2={62} y2={42} color={GL} thickness={5} opacity={0.8} u={u} />
      <Bar x={58} y={38} w={12} h={10} r={3} color={ac} opacity={0.85} u={u} />
    </>
  ),

  // hip-thrust
  "hip-thrust": (ac, u) => (
    <>
      <Bar x={6} y={50} w={30} h={8} r={4} color={S3} u={u} />
      <Bar x={8} y={34} w={64} h={5} r={2.5} color={ac} opacity={0.9} u={u} />
      <Bar x={4} y={30} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Bar x={65} y={30} w={11} h={11} r={3} color={ac} opacity={0.55} u={u} />
      <Circ cx={18} cy={44} r={6} color={GL} opacity={0.75} u={u} />
      <Line x1={18} y1={50} x2={36} y2={50} color={GL} thickness={6} opacity={0.65} u={u} />
      <Bar x={30} y={30} w={16} h={20} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={46} y1={44} x2={58} y2={52} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={58} y1={52} x2={60} y2={68} color={GL} thickness={4.5} opacity={0.7} u={u} />
      <Line x1={30} y1={50} x2={24} y2={66} color={GL} thickness={4.5} opacity={0.65} u={u} />
    </>
  ),

  // biceps-curl (basado en hammerCurl del prototipo)
  "biceps-curl": (ac, u) => (
    <>
      <Circ cx={40} cy={14} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={32} y={22} w={16} h={20} r={6} color={GL} opacity={0.65} u={u} />
      <Line x1={35} y1={42} x2={32} y2={70} color={GL} thickness={5} opacity={0.65} u={u} />
      <Line x1={45} y1={42} x2={48} y2={70} color={GL} thickness={5} opacity={0.65} u={u} />
      <Line x1={34} y1={28} x2={20} y2={34} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={20} y1={34} x2={22} y2={48} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Bar x={14} y={45} w={14} h={6} r={3} color={ac} opacity={0.9} u={u} />
      <Bar x={12} y={42} w={5} h={12} r={2.5} color={ac} opacity={0.65} u={u} />
      <Bar x={23} y={42} w={5} h={12} r={2.5} color={ac} opacity={0.65} u={u} />
      <Line x1={46} y1={28} x2={58} y2={38} color={GL} thickness={4.5} opacity={0.55} u={u} />
    </>
  ),

  // triceps-ext
  "triceps-ext": (ac, u) => (
    <>
      <Bar x={62} y={8} w={10} h={44} r={4} color={S3} u={u} />
      <Circ cx={67} cy={16} r={4} color={ac} opacity={0.9} u={u} />
      <Line x1={63} y1={16} x2={40} y2={28} color={ac} thickness={2} opacity={0.75} u={u} />
      <Circ cx={30} cy={18} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={23} y={26} w={14} h={18} r={5} color={GL} opacity={0.65} u={u} />
      <Line x1={34} y1={30} x2={40} y2={28} color={GL} thickness={4} opacity={0.85} u={u} />
      <Line x1={34} y1={36} x2={40} y2={44} color={GL} thickness={4} opacity={0.85} u={u} />
      <Line x1={26} y1={44} x2={22} y2={68} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={34} y1={44} x2={36} y2={68} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // lateral-raise
  "lateral-raise": (ac, u) => (
    <>
      <Circ cx={40} cy={16} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={33} y={24} w={14} h={18} r={5} color={GL} opacity={0.65} u={u} />
      <Line x1={33} y1={30} x2={12} y2={26} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={47} y1={30} x2={68} y2={26} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Bar x={4} y={22} w={12} h={6} r={3} color={ac} opacity={0.9} u={u} />
      <Bar x={64} y={22} w={12} h={6} r={3} color={ac} opacity={0.9} u={u} />
      <Line x1={37} y1={42} x2={33} y2={68} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={43} y1={42} x2={47} y2={68} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // cable
  "cable": (ac, u) => (
    <>
      <Bar x={60} y={8} w={12} h={64} r={4} color={S3} u={u} />
      <Circ cx={66} cy={18} r={5} color={ac} opacity={0.9} u={u} />
      <Circ cx={66} cy={52} r={5} color={ac} opacity={0.75} u={u} />
      <Line x1={62} y1={18} x2={30} y2={36} color={ac} thickness={2} opacity={0.8} u={u} />
      <Circ cx={24} cy={26} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={17} y={34} w={14} h={18} r={5} color={GL} opacity={0.65} u={u} />
      <Line x1={27} y1={36} x2={30} y2={36} color={GL} thickness={4} opacity={0.85} u={u} />
      <Line x1={20} y1={44} x2={12} y2={58} color={GL} thickness={4} opacity={0.65} u={u} />
      <Line x1={28} y1={44} x2={28} y2={62} color={GL} thickness={4} opacity={0.65} u={u} />
    </>
  ),

  // core-plank
  "core-plank": (ac, u) => (
    <>
      <Bar x={8} y={68} w={64} h={4} r={2} color={S4} opacity={0.6} u={u} />
      <Circ cx={18} cy={44} r={7} color={GL} opacity={0.75} u={u} />
      <Bar x={18} y={48} w={40} h={10} r={5} color={GL} opacity={0.65} u={u} />
      <Line x1={18} y1={52} x2={10} y2={68} color={GL} thickness={5} opacity={0.8} u={u} />
      <Line x1={56} y1={54} x2={60} y2={68} color={GL} thickness={5} opacity={0.75} u={u} />
      <Line x1={50} y1={56} x2={54} y2={68} color={GL} thickness={4.5} opacity={0.7} u={u} />
      {/* línea de acento punteada — simulada con dos barras cortas */}
      <Bar x={24} y={52} w={8} h={2} r={1} color={ac} opacity={0.7} u={u} />
      <Bar x={36} y={52} w={8} h={2} r={1} color={ac} opacity={0.7} u={u} />
      <Bar x={48} y={52} w={4} h={2} r={1} color={ac} opacity={0.7} u={u} />
    </>
  ),

  // cardio
  "cardio": (ac, u) => (
    <>
      <Circ cx={40} cy={14} r={7} color={GL} opacity={0.75} u={u} />
      <Line x1={40} y1={21} x2={36} y2={42} color={GL} thickness={6} opacity={0.65} u={u} />
      <Line x1={38} y1={28} x2={24} y2={22} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={38} y1={34} x2={52} y2={38} color={GL} thickness={4.5} opacity={0.85} u={u} />
      <Line x1={34} y1={42} x2={22} y2={56} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={22} y1={56} x2={18} y2={68} color={GL} thickness={4.5} opacity={0.7} u={u} />
      <Line x1={38} y1={42} x2={52} y2={50} color={GL} thickness={5.5} opacity={0.8} u={u} />
      <Line x1={52} y1={50} x2={60} y2={42} color={GL} thickness={4.5} opacity={0.7} u={u} />
      <Bar x={10} y={71} w={60} h={2} r={1} color={ac} opacity={0.5} u={u} />
    </>
  ),

  // machine-generic
  "machine-generic": (ac, u) => (
    <>
      <Bar x={12} y={10} w={56} h={60} r={6} color={S3} opacity={0.8} u={u} />
      <Bar x={18} y={16} w={44} h={32} r={4} color={S4} opacity={0.7} u={u} />
      <Bar x={22} y={20} w={36} h={22} r={3} color={colors.surface2} opacity={0.9} u={u} />
      <Circ cx={26} cy={54} r={3} color={ac} opacity={0.9} u={u} />
      <Circ cx={36} cy={54} r={3} color={ac} opacity={0.65} u={u} />
      <Circ cx={46} cy={54} r={3} color={ac} opacity={0.65} u={u} />
      <Circ cx={56} cy={54} r={3} color={ac} opacity={0.5} u={u} />
      <Bar x={16} y={68} w={8} h={6} r={2} color={S3} u={u} />
      <Bar x={56} y={68} w={8} h={6} r={2} color={S3} u={u} />
      {/* símbolo "F" en pantalla — triángulo Forzza */}
      <Line x1={36} y1={24} x2={40} y2={36} color={ac} thickness={2} opacity={0.9} u={u} />
      <Line x1={40} y1={36} x2={44} y2={24} color={ac} thickness={2} opacity={0.9} u={u} />
    </>
  ),
};

// ---------------------------------------------------------------------------
// Componente público
// ---------------------------------------------------------------------------

export type { ExerciseIconProps, ExerciseIconKey };

export function ExerciseIcon({
  icon,
  size = 40,
  color = colors.lime,
}: ExerciseIconProps) {
  const key = (icon in ICONS ? icon : "machine-generic") as ExerciseIconKey;
  const renderer = ICONS[key];
  // u = unidad de escala. viewBox es 80x80, size es la dimensión final en px.
  const u = size / 80;
  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      {renderer(color, u)}
    </View>
  );
}

