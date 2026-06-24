"use client";

import { Children, cloneElement, isValidElement, useId } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { motion } from "@forzza/ui/tokens";

/**
 * Entrada con stagger sutil para listas/filas del backoffice del coach.
 *
 * - Solo anima `opacity` + `transform: translateY(8px) -> 0` (GPU, sin reflow).
 * - Curva/duración desde tokens: var(--ease-out) + var(--duration-dropdown) (< 300ms).
 * - Delay entre items = motion.stagger (50ms, dentro de 30-80ms). Se aplica SOLO
 *   en el montaje: es una animación CSS de un solo disparo, no se repite en
 *   re-renders (no usa estado, no re-arranca salvo remonte del nodo).
 * - El stagger se topea con `maxStagger` para que listas largas no acumulen
 *   delays eternos ni demoren la interacción: pasado el tope, entran juntos.
 * - prefers-reduced-motion ya está cubierto globalmente (globals.css neutraliza
 *   *-duration), dejando el estado final (opacity:1).
 *
 * Clona cada hijo directo inyectando el `style` de animación, por lo que sirve
 * tanto para `<tr>` (tablas) como para `<div>`/`<details>` (grids/cards) sin
 * romper el HTML ni los estilos existentes del hijo (se hace merge de `style`).
 */
type StaggerListProps = {
  children: ReactNode;
  /** Cantidad máxima de items escalonados antes de entrar todos juntos. */
  maxStagger?: number;
};

export function StaggerList({ children, maxStagger = 10 }: StaggerListProps) {
  const rawId = useId();
  // useId() incluye ":" — inválido en nombres de @keyframes/selectores.
  const animName = `fz-stagger-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const items = Children.toArray(children);

  return (
    <>
      <style>{`@keyframes ${animName}{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ style?: CSSProperties }>;
        const step = Math.min(i, maxStagger);
        const style: CSSProperties = {
          ...(el.props.style ?? {}),
          animation: `${animName} var(--duration-dropdown) var(--ease-out) both`,
          animationDelay: `${step * motion.stagger}ms`,
        };
        return cloneElement(el, { style });
      })}
    </>
  );
}
