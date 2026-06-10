// gating — controles de acceso server-side
// isPro()/hasCoach() se calculan server-side; el cliente solo cachea.

export interface UserEntitlements {
  isPro: boolean;
  hasActiveCoach: boolean;
  routineCount: number;
}

export function canAddRoutine(entitlements: UserEntitlements): boolean {
  if (entitlements.isPro) return true;
  return entitlements.routineCount < 3; // FREE_MAX_ROUTINES
}

export function canViewWorkoutHistory(
  entitlements: UserEntitlements,
  daysAgo: number
): boolean {
  if (entitlements.isPro) return true;
  return daysAgo <= 10; // FREE_HISTORY_DAYS
}

export function shouldShowAutopromo(entitlements: UserEntitlements): boolean {
  return !entitlements.isPro;
}
