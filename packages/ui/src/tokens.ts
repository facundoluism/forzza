// ÚNICA fuente de verdad para colores, espaciado y tipografía.
// Regla: SOLO aquí pueden ir valores hex de colores.

export const colors = {
  // Primario
  lime: "#C8FF00",
  limeDark: "#8FB800",
  limeDim: "#A3D900",
  limeGlow: "rgba(200,255,0,0.15)",

  // Superficies (OLED-safe, premium dark)
  bg: "#080810",
  surface: "#0E0E18",
  surface2: "#141420",
  surface3: "#1C1C2C",
  surface4: "#242436",

  // Bordes
  border: "rgba(255,255,255,0.08)",

  // Texto
  text: "#F0F0FF",
  muted: "#9898C0",

  // Neutros
  gray: "#6868A0",
  black: "#0A0A0A",
  white: "#FAFAFA",
  gray900: "#111827",
  gray800: "#1F2937",
  gray700: "#374151",
  gray600: "#4B5563",
  gray500: "#6B7280",
  gray400: "#94A3B8",
  gray300: "#CBD5E1",
  gray200: "#E2E8F0",
  gray100: "#F1F5F9",

  // Semánticos
  error: "#FF4466",
  success: "#22C55E",
  warning: "#FF8840",
  info: "#4488FF",

  // Acentos
  orange: "#FF8840",
  purple: "#A78BFA",
} as const;

export const tipoColors = {
  fuerza: "#C8FF00",
  espalda: "#4488FF",
  piernas: "#FF8840",
  cardio: "#FF4466",
  descanso: "#6868A0",
  fullbody: "#A78BFA",
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const typography = {
  // BebasNeue — headings (condensed feel with fontWeight 900, letterSpacing -1)
  heading: "BebasNeue_400Regular",
  // DM Sans — body text
  body: "DMSans_400Regular",
  // Space Mono — numbers, timers, prices, codes
  mono: "SpaceMono_400Regular",
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
} as const;
