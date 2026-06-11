// Tipos compartidos del design system

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type InputState = "default" | "error" | "success" | "disabled";
export type PillVariant = "default" | "active" | "success" | "warning" | "error";
export type CardVariant = "surface" | "surface2" | "surface3";
export type ToastType = "success" | "error" | "warning" | "info";

export interface BaseComponentProps {
  testID?: string;
}
