/**
 * coach-checkout — Edge Function para el checkout de paquetes de coach con Split Payments.
 *
 * FASE B: en lugar del token de Forzza, se usa el access_token del COACH
 * (almacenado en coach_mp_accounts tras el OAuth de la Fase A) para crear
 * un pago dividido (split). La comisión de Forzza (marketplace_fee) queda
 * retenida automáticamente por MP; el neto del coach va directo a su cuenta.
 *
 * Flujo:
 *   1. Verifica JWT del alumno.
 *   2. Chequea edad + consentimiento parental (Regla #7).
 *   3. Valida paquete del coach (activo + coach aprobado).
 *   4. Lee country_config: commission_rate + mp_fee_pct (nunca hardcodeados).
 *   5. Calcula el desglose con calculateSplitBreakdown() de core/billing.
 *   6. Obtiene el access_token del coach desde coach_mp_accounts (service-role).
 *   7. Refresh proactivo del token si está vencido o próximo a vencer (<5 min).
 *   8. Llama a MP con el token del coach + marketplace_fee de Forzza.
 *   9. Inserta payment record + audit_log.
 *
 * Si el coach NO tiene cuenta MP conectada → 422 coach_mp_not_connected.
 * Si faltan credenciales OAuth (MP_OAUTH_CLIENT_ID/SECRET) → mock adapter activo.
 *
 * HUMAN_REQUIRED:
 *   - MP_OAUTH_CLIENT_ID y MP_OAUTH_CLIENT_SECRET → ver mp-oauth-connect/index.ts
 *   - El access_token del coach se obtiene tras su OAuth (supabase/functions/mp-oauth-connect)
 *   - Sin esos secretos la función opera con MOCK_MP_SPLIT=true (solo para dev/test)
 *
 * SUPUESTO SOBRE FEE DE MP (TO-CONFIRM con ejecutivo MP):
 *   La fee de MP se descuenta de los fondos del VENDEDOR (coach) primero, sobre el gross.
 *   El marketplace_fee que declara Forzza = forzzaCommission − mpFeeForzzaShare.
 *   Ver calculateSplitBreakdown() en packages/core/src/billing/index.ts para el punto de ajuste.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Tipos locales (mirror de core/billing — Deno no puede importar workspaces) ─

interface SplitBreakdownInput {
  gross: number;
  commissionPct: number;
  mpFeePct: number;
}

interface SplitBreakdownResult {
  gross: number;
  forzzaCommission: number;
  mpFeeTotal: number;
  mpFeeCoachShare: number;
  mpFeeForzzaShare: number;
  coachNet: number;
  marketplaceFee: number;
}

/**
 * Mirror de calculateSplitBreakdown() de packages/core/src/billing/index.ts
 *
 * REGLA: el cálculo canónico vive en core/billing. Este mirror existe SOLO
 * porque Deno no puede importar paquetes del workspace npm. Si la fórmula
 * cambia, ACTUALIZAR AMBOS y sus tests.
 *
 * Fórmula (decisión del dueño 2026-06-23):
 *   forzzaCommission  = round(gross × commissionPct)
 *   mpFeeTotal        = round(gross × mpFeePct / 10_000)
 *   mpFeeCoachShare   = round(mpFeeTotal / 2)          ← coach absorbe 50%
 *   mpFeeForzzaShare  = mpFeeTotal − mpFeeCoachShare   ← Forzza absorbe 50%
 *   coachNet          = gross − forzzaCommission − mpFeeCoachShare
 *   marketplaceFee    = forzzaCommission − mpFeeForzzaShare
 *
 * TO-CONFIRM con ejecutivo MP: cómo exactamente descuenta MP su fee del split.
 */
function calculateSplitBreakdown(
  input: SplitBreakdownInput
): SplitBreakdownResult {
  const { gross, commissionPct, mpFeePct } = input;

  const forzzaCommission = Math.round(gross * commissionPct);
  const mpFeeTotal = Math.round((gross * mpFeePct) / 10_000);
  const mpFeeCoachShare = Math.round(mpFeeTotal / 2);
  const mpFeeForzzaShare = mpFeeTotal - mpFeeCoachShare;
  const coachNet = gross - forzzaCommission - mpFeeCoachShare;
  const marketplaceFee = forzzaCommission - mpFeeForzzaShare;

  return {
    gross,
    forzzaCommission,
    mpFeeTotal,
    mpFeeCoachShare,
    mpFeeForzzaShare,
    coachNet,
    marketplaceFee,
  };
}

// ─── Refresh de token OAuth ───────────────────────────────────────────────────

/**
 * Refresca el access_token del coach si está vencido o próximo a vencer.
 *
 * Threshold: si quedan < 5 minutos para que venza, se refresca proactivamente.
 *
 * Retorna el access_token vigente (ya sea el original o el nuevo).
 * Si el refresh falla, lanza un error con código "token_refresh_failed".
 *
 * HUMAN_REQUIRED: MP_OAUTH_CLIENT_ID y MP_OAUTH_CLIENT_SECRET deben estar
 * configurados como Supabase secrets para que el refresh funcione.
 */
async function getValidCoachToken(
  supabaseService: ReturnType<typeof createClient>,
  coachMpAccount: {
    id: string;
    access_token: string;
    refresh_token: string;
    token_expires_at: string;
  },
  mpClientId: string | undefined,
  mpClientSecret: string | undefined
): Promise<string> {
  const expiresAt = new Date(coachMpAccount.token_expires_at);
  const fiveMinutes = 5 * 60 * 1000;
  const needsRefresh = expiresAt.getTime() - Date.now() < fiveMinutes;

  if (!needsRefresh) {
    return coachMpAccount.access_token;
  }

  // Token vencido o próximo a vencer → intentar refresh
  if (!mpClientId || !mpClientSecret) {
    // Sin credenciales OAuth no podemos refrescar — modo mock: retornar el token actual
    // aunque esté vencido (solo válido para tests).
    console.warn(
      "[coach-checkout] HUMAN_REQUIRED: MP_OAUTH_CLIENT_ID/SECRET no configurados. " +
        "No se puede refrescar el token del coach. En producción esto fallará."
    );
    return coachMpAccount.access_token;
  }

  const refreshPayload = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: mpClientId,
    client_secret: mpClientSecret,
    refresh_token: coachMpAccount.refresh_token,
  });

  const refreshResponse = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: refreshPayload.toString(),
  });

  if (!refreshResponse.ok) {
    const errStatus = refreshResponse.status;
    // NO loguear el body — puede contener datos sensibles del token
    console.error(
      "[coach-checkout] Token refresh failed, status:",
      errStatus
    );
    throw Object.assign(new Error("token_refresh_failed"), { status: errStatus });
  }

  const refreshData = (await refreshResponse.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope?: string;
  };

  const newExpiresAt = new Date(
    Date.now() + refreshData.expires_in * 1000
  ).toISOString();

  // Actualizar en DB (service-role, sin exponer tokens al cliente)
  const { error: updateError } = await supabaseService
    .from("coach_mp_accounts")
    .update({
      access_token: refreshData.access_token,
      refresh_token: refreshData.refresh_token,
      token_expires_at: newExpiresAt,
      status: "connected",
    })
    .eq("id", coachMpAccount.id);

  if (updateError) {
    console.error(
      "[coach-checkout] Failed to persist refreshed token:",
      updateError.code
    );
    // No bloqueamos el pago por un error de persistencia: usamos el token nuevo igual
  }

  return refreshData.access_token;
}

// ─── Crear pago en MP con Split ───────────────────────────────────────────────

interface MpSplitPaymentParams {
  reason: string;
  transactionAmount: number;  // en PESOS (no centavos) — MP espera la unidad monetaria
  currencyId: string;
  payerEmail: string;
  backUrl: string;
  marketplaceFee: number;     // en PESOS (no centavos) — mismo formato que transactionAmount
  coachAccessToken: string;
}

interface MpSplitPaymentResult {
  id: string;
  init_point: string;
  isMock: boolean;
}

/**
 * Crea un pago con Split Payments en MP Marketplace usando el token del COACH.
 *
 * Si isMockMode=true (faltan credenciales reales) devuelve datos mock sin llamada real.
 *
 * TO-CONFIRM con MP:
 *   El endpoint correcto para split en AR puede ser /checkout/preferences + marketplace_fee
 *   o /preapproval_plan + application_fee. La doc de Split Payments indica usar
 *   marketplace_fee en el objeto de la preferencia cuando se crea con el token del vendedor.
 *   Ajustar según la respuesta del ejecutivo técnico de MP.
 */
async function createMpSplitPayment(
  params: MpSplitPaymentParams,
  isMockMode: boolean
): Promise<MpSplitPaymentResult> {
  if (isMockMode) {
    const mockId = `mock_split_${Date.now()}`;
    return {
      id: mockId,
      init_point: `https://mock.mercadopago.com/split/checkout?id=${mockId}`,
      isMock: true,
    };
  }

  /**
   * Llamada real a MP con el token del coach (vendedor en el split).
   *
   * El coach es el vendedor: se autentifica con su access_token.
   * Forzza declara marketplace_fee para quedarse con su comisión.
   *
   * TO-CONFIRM con ejecutivo MP:
   *   - ¿El endpoint es /checkout/preferences o /preapproval_plan para paquetes mensuales?
   *   - ¿marketplace_fee o application_fee? (la doc usa ambos términos según el contexto)
   *   - ¿El monto de marketplace_fee debe estar en la misma moneda que transaction_amount?
   *
   * Por ahora usamos /checkout/preferences (pago único) como proxy para el primer
   * mes. Los meses subsiguientes deberían gestionarse con preapproval si se adopta
   * el modelo recurrente. Este punto queda abierto hasta la validación con MP.
   */
  const mpBody = {
    items: [
      {
        title: params.reason,
        quantity: 1,
        unit_price: params.transactionAmount,
        currency_id: params.currencyId,
      },
    ],
    payer: {
      email: params.payerEmail,
    },
    back_urls: {
      success: params.backUrl,
      failure: params.backUrl + "?status=failure",
      pending: params.backUrl + "?status=pending",
    },
    marketplace_fee: params.marketplaceFee,
  };

  const mpResponse = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
      method: "POST",
      headers: {
        // Token del COACH — es el vendedor en el split
        Authorization: `Bearer ${params.coachAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mpBody),
    }
  );

  if (!mpResponse.ok) {
    // NO loguear el body completo — puede contener datos del pago
    console.error(
      "[coach-checkout] MP split payment failed, status:",
      mpResponse.status
    );
    throw Object.assign(new Error("mp_split_error"), {
      mpStatus: mpResponse.status,
    });
  }

  const mpData = (await mpResponse.json()) as { id: string; init_point: string };
  return {
    id: mpData.id,
    init_point: mpData.init_point,
    isMock: false,
  };
}

// ─── Serve ────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "unauthorized" }),
      {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── Parse body ──
  let coach_id: string | undefined;
  let package_id: string | undefined;
  try {
    const body = (await req.json()) as {
      coach_id?: string;
      package_id?: string;
    };
    coach_id = body.coach_id;
    package_id = body.package_id;
  } catch {
    return new Response(
      JSON.stringify({ error: "invalid_body" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  if (!coach_id || !package_id) {
    return new Response(
      JSON.stringify({ error: "coach_id and package_id are required" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── Clientes Supabase ──
  // Cliente con JWT del alumno para verificar identidad y leer datos del alumno
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  // Cliente service-role para leer tokens OAuth del coach (secretos — nunca al cliente)
  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Verificar JWT del alumno ──
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(
      JSON.stringify({ error: "unauthorized" }),
      {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── País del alumno ──
  const { data: userRecord } = await supabase
    .from("users")
    .select("country")
    .eq("id", user.id)
    .single();

  // ── Regla #7: menor sin consentimiento parental → 403 ──
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("birth_date, parental_consent_at")
    .eq("user_id", user.id)
    .single();

  if (studentProfile?.birth_date) {
    const today = new Date();
    const birth = new Date(studentProfile.birth_date);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age -= 1;
    }
    if (age < 18 && !studentProfile.parental_consent_at) {
      return new Response(
        JSON.stringify({ error: "minor_no_consent" }),
        {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }
  }

  // ── Validar paquete del coach ──
  const { data: coachPackage } = await supabase
    .from("coach_packages")
    .select(
      "id, title, price, active, country, coach:coach_profiles(user_id, status, display_name)"
    )
    .eq("id", package_id)
    .eq("coach_id", coach_id)
    .eq("active", true)
    .single();

  if (
    !coachPackage ||
    (coachPackage.coach as { status: string } | null)?.status !== "approved"
  ) {
    return new Response(
      JSON.stringify({ error: "invalid_package" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // price está en centavos/enteros
  const priceInCents = coachPackage.price;
  const countryCode = userRecord?.country ?? "AR";

  // ── Leer country_config: commission_rate + mp_fee_pct (NUNCA hardcodeados) ──
  const { data: config } = await supabase
    .from("country_config")
    .select("currency_code, currency_symbol, commission_rate, mp_fee_pct")
    .eq("country", countryCode)
    .single();

  if (!config) {
    return new Response(
      JSON.stringify({ error: "country_config_not_found", country: countryCode }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  const currencyCode = config.currency_code ?? "ARS";
  const commissionRate: number = config.commission_rate ?? 0.20;
  // mp_fee_pct en bps (basis points) — DEFAULT 629 por la migración si la columna no existe aún
  const mpFeePct: number = (config as Record<string, unknown>).mp_fee_pct as number ?? 629;

  // ── Calcular desglose con Split Payments ──
  // Todo en ENTEROS (centavos). El redondeo vive SOLO en core/billing.
  const breakdown = calculateSplitBreakdown({
    gross: priceInCents,
    commissionPct: commissionRate,
    mpFeePct,
  });

  // MP espera montos en la UNIDAD MONETARIA (pesos), no en centavos.
  // División por 100 solo aquí para la llamada al API de MP.
  const transactionAmountInCurrency = priceInCents / 100;
  const marketplaceFeeInCurrency = breakdown.marketplaceFee / 100;

  // ── Obtener coach_mp_accounts (service-role — tokens son secretos) ──
  // La columna-level security de la migración bloquea acceso de `authenticated` a los tokens.
  // Usamos supabaseService (service-role) para leer los tokens.
  const { data: coachMpAccount } = await supabaseService
    .from("coach_mp_accounts")
    .select(
      "id, access_token, refresh_token, token_expires_at, status"
    )
    .eq("coach_id", coach_id)
    .eq("status", "connected")
    .single();

  if (!coachMpAccount) {
    // El coach no tiene cuenta MP vinculada → no se puede hacer el split
    return new Response(
      JSON.stringify({
        error: "coach_mp_not_connected",
        hint: "El coach debe vincular su cuenta de Mercado Pago antes de recibir pagos. Ver: /coach/configuracion/mercadopago",
      }),
      {
        status: 422,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── Credenciales OAuth (para refresh de token si es necesario) ──
  const mpClientId = Deno.env.get("MP_OAUTH_CLIENT_ID");
  const mpClientSecret = Deno.env.get("MP_OAUTH_CLIENT_SECRET");

  // Modo mock: si no hay credenciales OAuth reales, el split opera con mock
  const isMockMode = !mpClientId || !mpClientSecret;

  if (isMockMode) {
    console.warn(
      "[coach-checkout] HUMAN_REQUIRED: MP_OAUTH_CLIENT_ID/SECRET no configurados. " +
        "Operando en modo MOCK. El pago NO es real. " +
        "Configurar los secretos con: supabase secrets set MP_OAUTH_CLIENT_ID=... MP_OAUTH_CLIENT_SECRET=..."
    );
  }

  // ── Obtener token válido del coach (con refresh proactivo si necesario) ──
  let coachAccessToken: string;
  try {
    coachAccessToken = await getValidCoachToken(
      supabaseService,
      {
        id: coachMpAccount.id,
        access_token: coachMpAccount.access_token,
        refresh_token: coachMpAccount.refresh_token,
        token_expires_at: coachMpAccount.token_expires_at,
      },
      mpClientId,
      mpClientSecret
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "unknown";
    return new Response(
      JSON.stringify({ error: "token_refresh_failed", detail: errMsg }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── Crear el pago split en MP ──
  const coachDisplayName =
    (coachPackage.coach as { display_name: string } | null)?.display_name ?? "Coach";
  let mpResult: MpSplitPaymentResult;
  try {
    mpResult = await createMpSplitPayment(
      {
        reason: `Forzza Coach: ${coachPackage.title} — ${coachDisplayName}`,
        transactionAmount: transactionAmountInCurrency,
        currencyId: currencyCode,
        payerEmail: user.email ?? "",
        backUrl: `${
          Deno.env.get("APP_URL") ?? "https://forzza.app"
        }/marketplace?payment=success`,
        marketplaceFee: marketplaceFeeInCurrency,
        coachAccessToken,
      },
      isMockMode
    );
  } catch (err) {
    const mpStatus =
      err instanceof Error &&
      "mpStatus" in err
        ? (err as { mpStatus: number }).mpStatus
        : undefined;
    return new Response(
      JSON.stringify({
        error: "mp_split_error",
        ...(mpStatus && { mp_status: mpStatus }),
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  // ── Insertar payment record ──
  // amount en CENTAVOS (enteros). El gateway_payment_id es el id de MP.
  const coachUserId =
    (coachPackage.coach as { user_id: string } | null)?.user_id ?? coach_id;

  await supabase.from("payments").insert({
    user_id: user.id,
    coach_id: coachUserId,
    amount: priceInCents,
    currency: currencyCode,
    status: "pending",
    gateway: "mercadopago",
    gateway_payment_id: mpResult.id,
    metadata: {
      package_id,
      coach_id,
      mp_payment_id: mpResult.id,
      is_split: true,
      is_mock: mpResult.isMock,
      breakdown: {
        gross: breakdown.gross,
        forzzaCommission: breakdown.forzzaCommission,
        mpFeeTotal: breakdown.mpFeeTotal,
        mpFeeCoachShare: breakdown.mpFeeCoachShare,
        mpFeeForzzaShare: breakdown.mpFeeForzzaShare,
        coachNet: breakdown.coachNet,
        marketplaceFee: breakdown.marketplaceFee,
      },
    },
  });

  // ── Audit log (TODA mutación financiera) ──
  // NO incluir access_token ni datos de tarjeta en el payload.
  await supabaseService.from("audit_log").insert({
    actor_id: user.id,
    action: "coach_checkout_split_initiated",
    entity_type: "payment",
    entity_id: null,
    payload: {
      coach_id,
      package_id,
      amount_cents: priceInCents,
      currency: currencyCode,
      mp_payment_id: mpResult.id,
      is_split: true,
      is_mock: mpResult.isMock,
      marketplace_fee_cents: breakdown.marketplaceFee,
      forzza_commission_cents: breakdown.forzzaCommission,
      coach_net_cents: breakdown.coachNet,
      mp_fee_total_cents: breakdown.mpFeeTotal,
      // NO loguear access_token ni refresh_token
    },
  });

  return new Response(
    JSON.stringify({
      init_point: mpResult.init_point,
      is_mock: mpResult.isMock,
      // Desglose para mostrar al usuario en la UI
      breakdown: {
        gross_cents: breakdown.gross,
        forzza_commission_cents: breakdown.forzzaCommission,
        mp_fee_coach_share_cents: breakdown.mpFeeCoachShare,
        coach_net_cents: breakdown.coachNet,
        currency: currencyCode,
      },
    }),
    {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    }
  );
});
