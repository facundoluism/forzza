import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const TAX_CONDITIONS = [
  "consumidor_final",
  "monotributo",
  "responsable_inscripto",
  "exento",
] as const;

const DOC_TYPES = ["DNI", "CUIT", "CUIL"] as const;

const billingProfileSchema = z.object({
  legal_name: z.string().min(1, "El nombre/razón social es requerido").max(200),
  tax_condition: z.enum(TAX_CONDITIONS, {
    errorMap: () => ({ message: "Condición IVA inválida" }),
  }),
  doc_type: z.enum(DOC_TYPES, {
    errorMap: () => ({ message: "Tipo de documento inválido" }),
  }),
  doc_number: z
    .string()
    .min(1, "El número de documento es requerido")
    .max(20)
    .regex(/^[\d\-]+$/, "El número de documento solo puede contener dígitos y guiones"),
  address: z.string().max(300).nullable().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("billing_profiles")
      .select(
        "legal_name, tax_condition, doc_type, doc_number, address, updated_at"
      )
      .eq("user_id", user.id)
      .single();

    if (error && error.code === "PGRST116") {
      // Not found — return null, not an error
      return NextResponse.json({ profile: null });
    }

    if (error) {
      return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = billingProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { legal_name, tax_condition, doc_type, doc_number, address } =
      parsed.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("billing_profiles")
      .upsert(
        {
          user_id: user.id,
          legal_name,
          tax_condition,
          doc_type,
          doc_number,
          address: address ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Error upserting billing profile:", error);
      return NextResponse.json(
        { error: "Error al guardar los datos de facturación" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
