import { colors, spacing } from "../tokens";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "📭",
}: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: `${spacing[10]}px ${spacing[6]}px` }}>
      <p style={{ fontSize: "64px", margin: 0, marginBottom: `${spacing[4]}px` }}>{icon}</p>
      <h3 style={{ color: colors.white, margin: 0, marginBottom: `${spacing[2]}px`, fontSize: "20px" }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: colors.gray400, fontSize: "14px", lineHeight: "1.5", margin: 0, marginBottom: `${spacing[4]}px` }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onClick={onAction} />
      )}
    </div>
  );
}
