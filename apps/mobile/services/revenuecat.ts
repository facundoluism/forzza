import { FEATURE_FLAGS } from "@forzza/config";

export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Stub: in V1 APPLE_PAYMENTS and GOOGLE_PAYMENTS are false
// Real SDK: react-native-purchases (not installed in V1)
export async function purchasePro(): Promise<PurchaseResult> {
  if (!FEATURE_FLAGS.APPLE_PAYMENTS && !FEATURE_FLAGS.GOOGLE_PAYMENTS) {
    // V1 stub — payments go through Mercado Pago web flow
    return {
      success: false,
      error: "Pagos in-app no disponibles en esta versión. Usá el sitio web.",
    };
  }
  // TODO: implement react-native-purchases when FEATURE_FLAGS enabled
  return { success: false, error: "No implementado" };
}

export async function restorePurchases(): Promise<PurchaseResult> {
  if (!FEATURE_FLAGS.APPLE_PAYMENTS && !FEATURE_FLAGS.GOOGLE_PAYMENTS) {
    return { success: false, error: "No disponible" };
  }
  return { success: false, error: "No implementado" };
}
