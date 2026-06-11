// ÚNICA fuente de verdad para colores, espaciado y tipografía.
// Regla: SOLO aquí pueden ir valores hex de colores.

export const colors = {
  // Primario
  lime: "#C8FF00",
  limeDark: "#A3D900",
  limeDim: "#A3D900",
  limeGlow: "rgba(200,255,0,0.15)",

  // Superficies (OLED-safe, premium dark)
  bg: "#0A0A0A",
  surface: "#111827",
  surface2: "#1F2937",

  // Bordes
  border: "rgba(255,255,255,0.08)",

  // Texto
  text: "#F8FAFC",
  muted: "#94A3B8",

  // Neutros (mantenidos para compatibilidad)
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
  error: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  info: "#0088FF",
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
  heading: "BebasNeue",
  // DM Sans — body text
  body: "DMSans",
  // Space Mono — numbers, timers, prices, codes
  mono: "SpaceMono",
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
