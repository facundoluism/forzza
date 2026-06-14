import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const questionSchema = z.object({
  label: z.string().min(1).max(500),
  question_type: z.enum(["text", "number", "boolean", "photo"]),
  required: z.boolean().optional().default(true),
  order: z.number().int().positive(),
});

const templateSchema = z.object({
  name: z.string().min(1).max(200),
  questions: z.array(questionSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify coach role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = templateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, questions } = parsed.data;

    // Create template with questions embedded as JSONB
    const { data: template, error: tmplError } = await supabase
      .from("checkin_templates")
      .insert({ coach_id: user.id, title: name, questions })
      .select("id")
      .single();

    if (tmplError || !template) {
      console.error("Error creating checkin template:", tmplError);
      return NextResponse.json(
        { error: "Error al crear la plantilla" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: template.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
