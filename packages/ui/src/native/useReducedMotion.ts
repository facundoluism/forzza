import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Devuelve `true` si el usuario activó "reducir movimiento" en el SO.
 * Úsalo para suavizar/quitar animaciones de posición (manteniendo opacity/color).
 * Equivalente mobile de `@media (prefers-reduced-motion: reduce)` en web.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => {
      setReduced(v);
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
