-- =============================================================================
-- MIGRACIÓN: columna features en coach_packages
-- Descripción: agrega lista de beneficios/bullets del paquete (e.g. "2 sesiones por semana").
--              No cambia RLS: hereda las políticas existentes de coach_packages.
-- =============================================================================

ALTER TABLE public.coach_packages
  ADD COLUMN IF NOT EXISTS features text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN public.coach_packages.features IS
  'Lista de beneficios/bullets del paquete, e.g. ["2 sesiones por semana","chat ilimitado"].';
