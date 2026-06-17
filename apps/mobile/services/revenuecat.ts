/**
 * RevenueCat IAP service for mobile PRO subscriptions.
 *
 * Used ONLY in the mobile app (apps/mobile).
 * Web PRO and coach packages use Mercado Pago — never IAP (§3 CLAUDE.md).
 *
 * SDK: react-native-purchases v10.x
 * Product IDs required in App Store Connect and Google Play Console:
 *   - Product identifier: com.forzza.app.pro_monthly
 *   - RevenueCat entitlement: pro
 *   - RevenueCat offering: default (identifier "$rc_default")
 *   - Package in that offering: MONTHLY type
 *
 * HUMAN_REQUIRED: see bottom of file for sandbox setup checklist.
 */
import Purchases, {
  PURCHASES_ERROR_CODE,
  type PurchasesError,
} from "react-native-purchases";
import { Platform } from "react-native";
import { FEATURE_FLAGS } from "@forzza/config";

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  /** true when the user explicitly cancelled the purchase sheet */
  userCancelled?: boolean;
}

const IOS_API_KEY = process.env["EXPO_PUBLIC_REVENUECAT_IOS_API_KEY"] ?? "";
const ANDROID_API_KEY =
  process.env["EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY"] ?? "";

/** Entitlement identifier configured in the RevenueCat dashboard. */
const ENTITLEMENT_PRO = "pro";

/**
 * Package identifier for the monthly PRO package inside the default offering.
 * RevenueCat MONTHLY packages have identifier "$rc_monthly".
 * If the package was added with a custom identifier, change this constant to match.
 */
const PACKAGE_MONTHLY_ID = "$rc_monthly";

let _configured = false;

/**
 * Configure the RevenueCat SDK once per app session.
 * Safe to call multiple times — subsequent calls are no-ops.
 * Must be called before any purchase or restore operation.
 */
function ensureConfigured(): void {
  if (_configured) return;

  const apiKey = Platform.OS === "ios" ? IOS_API_KEY : ANDROID_API_KEY;

  if (!apiKey) {
    // Warn loudly in dev so the developer knows to set the env var.
    // In production this means purchases will fail — caught by callers.
    console.warn(
      "[RevenueCat] EXPO_PUBLIC_REVENUECAT_IOS_API_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY " +
        "no configuradas. Revisá .env y .env.example."
    );
    return;
  }

  Purchases.configure({ apiKey });
  _configured = true;
}

/**
 * Returns true if IAP is enabled by feature flags for the current platform.
 * Both flags off → payments go through Mercado Pago web (V1 behaviour).
 */
function isIapEnabled(): boolean {
  return Platform.OS === "ios"
    ? FEATURE_FLAGS.APPLE_PAYMENTS
    : FEATURE_FLAGS.GOOGLE_PAYMENTS;
}

/**
 * Log the Supabase user ID into RevenueCat so purchase history is tied
 * to the backend user, not the anonymous RevenueCat ID.
 * Call after successful Supabase sign-in.
 */
export async function loginRevenueCat(supabaseUserId: string): Promise<void> {
  if (!isIapEnabled()) return;
  ensureConfigured();
  try {
    await Purchases.logIn(supabaseUserId);
  } catch (e) {
    // Non-fatal: purchases still work with the anonymous ID
    console.warn("[RevenueCat] logIn failed", e);
  }
}

/**
 * Purchase the PRO monthly subscription via IAP.
 *
 * - Fetches current offerings and finds the MONTHLY package in the default offering.
 * - Handles user cancellation separately from other errors.
 * - Network errors produce a descriptive message.
 *
 * Returns { success: true, transactionId } on success.
 * Returns { success: false, userCancelled: true } if the user dismissed the sheet.
 * Returns { success: false, error } on any other failure.
 */
export async function purchasePro(): Promise<PurchaseResult> {
  if (!isIapEnabled()) {
    return {
      success: false,
      error:
        "Pagos in-app no habilitados en esta versión. Suscribite desde el sitio web.",
    };
  }

  ensureConfigured();

  if (!IOS_API_KEY && !ANDROID_API_KEY) {
    return {
      success: false,
      error: "Configuración de pagos incompleta. Contactá soporte.",
    };
  }

  try {
    // 1. Fetch available offerings from RevenueCat
    const offerings = await Purchases.getOfferings();

    const currentOffering = offerings.current;
    if (!currentOffering) {
      return {
        success: false,
        error:
          "No hay planes disponibles en este momento. Intentá de nuevo más tarde.",
      };
    }

    // 2. Find the monthly package
    const proPackage =
      currentOffering.availablePackages.find(
        (pkg) => pkg.identifier === PACKAGE_MONTHLY_ID
      ) ?? null;

    if (!proPackage) {
      return {
        success: false,
        error: "El plan mensual no está disponible. Contactá soporte.",
      };
    }

    // 3. Execute the purchase
    const result = await Purchases.purchasePackage(proPackage);

    // 4. Verify entitlement is active
    const proEntitlement = result.customerInfo.entitlements.active[ENTITLEMENT_PRO];
    if (!proEntitlement) {
      // Purchase went through but entitlement not active yet — edge case
      return {
        success: false,
        error:
          "La compra fue procesada pero el plan todavía no se activó. Restaurá tu compra en unos minutos.",
      };
    }

    return {
      success: true,
      transactionId: result.transaction?.transactionIdentifier ?? undefined,
    };
  } catch (e: unknown) {
    const err = e as PurchasesError;

    // User explicitly closed the purchase sheet — not an error to show
    if (
      err?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
      err?.userCancelled === true
    ) {
      return { success: false, userCancelled: true };
    }

    // Network error
    if (err?.code === PURCHASES_ERROR_CODE.NETWORK_ERROR ||
        err?.code === PURCHASES_ERROR_CODE.OFFLINE_CONNECTION_ERROR) {
      return {
        success: false,
        error: "Sin conexión. Revisá tu internet e intentá de nuevo.",
      };
    }

    // Product already purchased (e.g. restoring active sub)
    if (err?.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      return {
        success: false,
        error:
          "Ya tenés este plan activo. Restaurá tu compra si no se refleja en la app.",
      };
    }

    return {
      success: false,
      error: err?.message ?? "Error inesperado al procesar el pago.",
    };
  }
}

/**
 * Restore previous purchases from the App Store / Google Play.
 * Checks if the `pro` entitlement is active after restore.
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (!isIapEnabled()) {
    return {
      success: false,
      error: "Restaurar compras no disponible en esta versión.",
    };
  }

  ensureConfigured();

  if (!IOS_API_KEY && !ANDROID_API_KEY) {
    return {
      success: false,
      error: "Configuración de pagos incompleta. Contactá soporte.",
    };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    const proEntitlement = customerInfo.entitlements.active[ENTITLEMENT_PRO];

    if (proEntitlement) {
      return { success: true };
    }

    return {
      success: false,
      error:
        "No encontramos compras previas asociadas a tu cuenta de la tienda.",
    };
  } catch (e: unknown) {
    const err = e as PurchasesError;

    if (err?.code === PURCHASES_ERROR_CODE.NETWORK_ERROR ||
        err?.code === PURCHASES_ERROR_CODE.OFFLINE_CONNECTION_ERROR) {
      return {
        success: false,
        error: "Sin conexión. Revisá tu internet e intentá de nuevo.",
      };
    }

    return {
      success: false,
      error: err?.message ?? "No se pudo restaurar la compra.",
    };
  }
}

/*
 * =============================================================================
 * HUMAN_REQUIRED — Sandbox / producción setup antes de QA
 * =============================================================================
 *
 * 1. App Store Connect (iOS):
 *    - Crear suscripción: Product ID = "com.forzza.app.pro_monthly"
 *    - Tipo: Auto-Renewable Subscription
 *    - Grupo de suscripciones: "Forzza PRO"
 *    - Precio: a definir en AR (Argentina) y otros mercados
 *    - Sandbox testers: crear cuentas en Users & Access → Sandbox → Test Accounts
 *
 * 2. Google Play Console (Android):
 *    - Crear suscripción: Product ID = "com.forzza.app.pro_monthly"
 *    - Período de facturación: mensual
 *    - Precio: a definir
 *    - Testers: agregar cuenta de prueba en Internal Testing → Testers
 *
 * 3. RevenueCat Dashboard (app.revenuecat.com):
 *    - Crear proyecto "Forzza"
 *    - Conectar App Store app (bundle ID: com.forzza.app) y Google Play app (package: com.forzza.app)
 *    - Obtener API Keys:
 *        iOS → Apps → [app] → API Keys → Public SDK Key → EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
 *        Android → Apps → [app] → API Keys → Public SDK Key → EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
 *    - Crear entitlement: identifier = "pro"
 *    - Crear producto: identificar "com.forzza.app.pro_monthly" en ambas tiendas
 *    - Crear offering: identifier = "$rc_default" (el SDK lo detecta como `offerings.current`)
 *    - Agregar package mensual con identifier "$rc_monthly" en ese offering
 *    - Adjuntar el producto "pro_monthly" al package
 *    - Adjuntar el entitlement "pro" al producto
 *
 * 4. Variables de entorno (.env local y dashboards de CI/EAS):
 *    EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_xxxxxx
 *    EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_xxxxxx
 *
 * 5. EAS Build: estas variables deben estar en eas.json bajo "env" o en los secretos
 *    del proyecto en expo.dev (Settings → Secrets).
 * =============================================================================
 */
