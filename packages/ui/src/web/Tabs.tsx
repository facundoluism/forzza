import type { CSSProperties } from "react";
import { colors, spacing, fontSize } from "../tokens";

export interface TabItem {
  key: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onTabChange: (key: string) => void;
  style?: CSSProperties;
}

export function Tabs({ tabs, activeKey, onTabChange, style }: TabsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderBottom: `1px solid ${colors.border}`,
        overflowX: "auto",
        gap: `${spacing[2]}px`,
        paddingLeft: `${spacing[4]}px`,
        paddingRight: `${spacing[4]}px`,
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            style={{
              padding: `${spacing[3]}px ${spacing[4]}px`,
              background: "none",
              border: "none",
              borderBottom: `2px solid ${isActive ? colors.lime : "transparent"}`,
              marginBottom: "-1px",
              color: isActive ? colors.lime : colors.muted,
              fontSize: `${fontSize.sm}px`,
              fontWeight: 600,
              letterSpacing: "0.3px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.15s, border-color 0.15s",
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
