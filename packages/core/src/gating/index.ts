// gating — controles de acceso server-side
// isPro()/hasCoach() se calculan server-side; el cliente solo cachea.

export const FREE_MAX_ROUTINES = 3;
export const FREE_HISTORY_DAYS = 10;

export interface UserEntitlements {
  isPro: boolean;
  hasActiveCoach: boolean;
  routineCount: number;
}

export function canAddRoutine(entitlements: UserEntitlements): boolean {
  if (entitlements.isPro) return true;
  return entitlements.routineCount < FREE_MAX_ROUTINES;
}

export function canViewWorkoutHistory(
  entitlements: UserEntitlements,
  daysAgo: number
): boolean {
  if (entitlements.isPro) return true;
  return daysAgo <= FREE_HISTORY_DAYS;
}

export function shouldShowAutopromo(entitlements: UserEntitlements): boolean {
  // Coached students and PRO users never see the autopromo modal
  if (entitlements.hasActiveCoach) return false;
  return !entitlements.isPro;
}

// ─── Regla: menor de 18 sin consentimiento parental → 403 antes del checkout ─

export interface MinorCheckInput {
  /** Fecha de nacimiento ISO 8601: "YYYY-MM-DD" */
  birthDate: string | null | undefined;
  /** Timestamp de consentimiento parental — null si no existe */
  parentalConsentAt: string | null | undefined;
}

/**
 * Retorna true si el usuario es menor de 18 Y no tiene consentimiento parental.
 * Usado por coach-checkout Edge Function para emitir 403.
 */
export function isMinorWithoutConsent(input: MinorCheckInput): boolean {
  if (!input.birthDate) return false; // sin fecha de nacimiento no podemos determinar
  const today = new Date();
  const birth = new Date(input.birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  const isMinor = age < 18;
  return isMinor && !input.parentalConsentAt;
}
