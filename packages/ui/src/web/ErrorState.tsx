import { colors, spacing } from "../tokens";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Algo salió mal",
  description = "Ocurrió un error inesperado. Intentá de nuevo.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div style={{ textAlign: "center", padding: `${spacing[10]}px ${spacing[6]}px` }}>
      <p style={{ fontSize: "48px", margin: 0, marginBottom: `${spacing[4]}px` }}>⚠️</p>
      <h3 style={{ color: colors.error, margin: 0, marginBottom: `${spacing[2]}px`, fontSize: "18px" }}>
        {title}
      </h3>
      <p style={{ color: colors.gray400, fontSize: "14px", lineHeight: "1.5", margin: 0, marginBottom: `${spacing[4]}px` }}>
        {description}
      </p>
      {onRetry && <Button label="Intentar de nuevo" variant="secondary" onClick={onRetry} />}
    </div>
  );
}
