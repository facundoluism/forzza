import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

interface CountryConfig {
  pro_monthly_price_cents: number;
  currency_code: string;
  currency_symbol: string;
}

interface ProPriceResult {
  formatted: string;
  note: string;
  error?: boolean;
}

async function getProPrice(): Promise<ProPriceResult> {
  if (!isSupabaseConfigured()) {
    return {
      formatted: "$ 9.999",
      note: "por mes en ARS · cancelá cuando quieras",
    };
  }
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("country_config")
      .select("pro_monthly_price_cents, currency_code, currency_symbol")
      .eq("country", "AR")
      .single();

    if (error || !data) {
      return {
        formatted: "$ 9.999",
        note: "por mes en ARS · cancelá cuando quieras",
        error: true,
      };
    }

    const config = data as CountryConfig;
    const amount = config.pro_monthly_price_cents / 100;
    const symbol = config.currency_symbol ?? "$";
    const formatted = `${symbol}${amount.toLocaleString("es-AR")}`;
    return {
      formatted,
      note: `por mes en ${config.currency_code} · cancelá cuando quieras`,
    };
  } catch {
    return {
      formatted: "$ 9.999",
      note: "por mes en ARS · cancelá cuando quieras",
      error: true,
    };
  }
}

/**
 * Server component async — se renderiza dentro de un Suspense boundary
 * en upgrade/page.tsx para mostrar skeleton mientras resuelve.
 */
export async function PriceBlock(): Promise<React.JSX.Element> {
  const proPrice = await getProPrice();

  return (
    <>
      <div className="text-text text-4xl font-black leading-none">
        {proPrice.formatted}
      </div>
      <div className="text-muted text-sm mt-1">{proPrice.note}</div>
      {proPrice.error && (
        <p className="text-warning text-xs mt-1">
          Precio de referencia — verificá al confirmar
        </p>
      )}
    </>
  );
}
