"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { colors, spacing, radius, fontSize } from "../tokens";

export interface NotificationRowProps {
  icon: ReactNode;
  title: string;
  body: string;
  time: string;
  read?: boolean;
  onPress?: () => void;
  style?: CSSProperties;
}

export function NotificationRow({
  icon,
  title,
  body,
  time,
  read = false,
  onPress,
  style,
}: NotificationRowProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={onPress}
      role={onPress ? "button" : undefined}
      tabIndex={onPress ? 0 : undefined}
      onKeyDown={onPress ? (e) => { if (e.key === "Enter" || e.key === " ") onPress(); } : undefined}
      onMouseDown={onPress ? () => setPressed(true) : undefined}
      onMouseUp={onPress ? () => setPressed(false) : undefined}
      onMouseLeave={onPress ? () => setPressed(false) : undefined}
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: `${spacing[3]}px ${spacing[4]}px`,
        gap: `${spacing[3]}px`,
        backgroundColor: read ? "transparent" : colors.surface2,
        cursor: onPress ? "pointer" : "default",
        transition: "opacity 0.15s, transform var(--duration-press) var(--ease-out)",
        transform: onPress && pressed ? "scale(var(--press-scale))" : "scale(1)",
        ...style,
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: `${radius.full}px`,
          backgroundColor: colors.surface3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: `${spacing[1]}px`, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: `${spacing[2]}px` }}>
          <span
            style={{
              fontSize: `${fontSize.sm}px`,
              color: read ? colors.muted : colors.text,
              fontWeight: read ? 500 : 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: `${fontSize.xs}px`,
              color: colors.gray,
              flexShrink: 0,
            }}
          >
            {time}
          </span>
        </div>
        <span
          style={{
            fontSize: `${fontSize.xs}px`,
            color: colors.muted,
            lineHeight: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {body}
        </span>
      </div>
      {!read && (
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: `${radius.full}px`,
            backgroundColor: colors.lime,
            marginTop: "6px",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}
