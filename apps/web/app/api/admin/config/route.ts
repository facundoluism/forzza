import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import type { CountryCode } from "@forzza/db-types";

interface PatchBody {
  country_code: string;
  commission_rate: number;
  min_coach_price: number;
  pro_monthly_price_cents: number;
  currency_symbol: string;
  active: boolean;
}

export async function PATCH(req: NextRequest) {
  try {
    const { adminClient, user } = await requireAdmin();

    const body = (await req.json()) as PatchBody;
    const {
      country_code,
      commission_rate,
      min_coach_price,
      pro_monthly_price_cents,
      currency_symbol,
      active,
    } = body;

    const VALID_COUNTRIES: CountryCode[] = ["AR", "CL"];

    if (!country_code || !VALID_COUNTRIES.includes(country_code as CountryCode)) {
      return NextResponse.json(
        { error: "country_code inválido" },
        { status: 400 }
      );
    }

    const typedCountryCode = country_code as CountryCode;

    if (
      typeof commission_rate !== "number" ||
      commission_rate < 0 ||
      commission_rate > 1
    ) {
      return NextResponse.json(
        { error: "La comisión debe estar entre 0 y 1 (0% a 100%)" },
        { status: 400 }
      );
    }

    if (typeof min_coach_price !== "number" || min_coach_price <= 0) {
      return NextResponse.json(
        { error: "El precio mínimo del coach debe ser mayor a 0" },
        { status: 400 }
      );
    }

    if (
      typeof pro_monthly_price_cents !== "number" ||
      pro_monthly_price_cents <= 0
    ) {
      return NextResponse.json(
        { error: "El precio PRO mensual debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // Fetch current config for audit log
    const { data: current } = await adminClient
      .from("country_config")
      .select(
        "commission_rate, min_coach_price, pro_monthly_price_cents, currency_symbol, active"
      )
      .eq("country", typedCountryCode)
      .single();

    // Update
    const { error: updateError } = await adminClient
      .from("country_config")
      .update({
        commission_rate,
        min_coach_price,
        pro_monthly_price_cents,
        currency_symbol,
        active,
      })
      .eq("country", typedCountryCode);

    if (updateError) {
      console.error("Error updating country_config:", updateError);
      return NextResponse.json(
        { error: "Error al guardar la configuración" },
        { status: 500 }
      );
    }

    // Write audit log
    await adminClient.from("audit_log").insert({
      actor_id: user.id,
      action: "config.updated",
      entity_type: "country_config",
      entity_id: country_code,
      payload: {
        previous: current ?? {},
        updated: {
          commission_rate,
          min_coach_price,
          pro_monthly_price_cents,
          currency_symbol,
          active,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin config PATCH error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
