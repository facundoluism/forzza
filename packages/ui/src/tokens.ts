// ÚNICA fuente de verdad para colores, espaciado y tipografía.
// Regla: SOLO aquí pueden ir valores hex de colores.

export const colors = {
  // Primario
  lime: "#C8FF00",
  limeDark: "#A8E000",

  // Neutros
  black: "#0A0A0A",
  white: "#FAFAFA",
  gray900: "#1A1A1A",
  gray800: "#2A2A2A",
  gray700: "#3A3A3A",
  gray600: "#4A4A4A",
  gray500: "#6A6A6A",
  gray400: "#8A8A8A",
  gray300: "#AAAAAA",
  gray200: "#CCCCCC",
  gray100: "#EEEEEE",

  // Semánticos
  error: "#FF4444",
  success: "#00CC66",
  warning: "#FFAA00",
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
  // Bebas Neue — headings
  heading: "BebasNeue",
  // DM Sans — cuerpo
  body: "DMSans",
  // Space Mono — números, dinero (derecha)
  mono: "SpaceMono",
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
