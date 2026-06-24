"use client";

import { useState, type InputHTMLAttributes } from "react";
import { colors, spacing, radius } from "../tokens";
import type { InputState } from "../types";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style"> {
  label?: string;
  hint?: string;
  error?: string;
  state?: InputState;
}

export function Input({ label, hint, error, state = "default", id, onFocus, onBlur, ...rest }: InputProps) {
  const hasError = state === "error" || !!error;
  const isDisabled = state === "disabled";
  const [focused, setFocused] = useState(false);

  // El color de estado (error/success) manda; si no, lima al foco, gris en reposo.
  const borderColor = hasError
    ? colors.error
    : state === "success"
    ? colors.success
    : focused
    ? colors.lime
    : colors.gray700;

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          htmlFor={id}
          style={{ display: "block", color: colors.gray300, fontSize: "14px", marginBottom: `${spacing[2]}px` }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        disabled={isDisabled}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          width: "100%",
          padding: `${spacing[3]}px`,
          backgroundColor: colors.gray900,
          border: `1px solid ${borderColor}`,
          borderRadius: `${radius.md}px`,
          color: colors.white,
          fontSize: "16px",
          outline: "none",
          boxSizing: "border-box",
          opacity: isDisabled ? 0.5 : 1,
          transition: "border-color var(--duration-press) var(--ease-out)",
        }}
        {...rest}
      />
      {(error ?? hint) ? (
        <p style={{
          color: hasError ? colors.error : colors.gray400,
          fontSize: "12px",
          marginTop: `${spacing[1]}px`,
          margin: 0,
          paddingTop: `${spacing[1]}px`,
        }}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
