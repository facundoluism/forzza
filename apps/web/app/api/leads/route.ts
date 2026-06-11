import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const leadSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const supabase = await createClient();
    // leads table is not yet in the generated Database types — cast until db:types is regenerated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("leads").insert([
      { email: result.data.email, source: result.data.source ?? "landing" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any[]);

    if (error) {
      if (error.code === "23505") {
        // Duplicate key — ya registrado, ok
        return NextResponse.json({ ok: true });
      }
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
