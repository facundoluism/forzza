import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const packageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).nullable().optional(),
  price_cents: z.number().int().positive(),
  billing_type: z.enum(["mensual", "paquete"]),
  features: z.array(z.string()).optional().default([]),
  is_active: z.boolean().optional().default(true),
  _deleted: z.boolean().optional().default(false),
});

const perfilSchema = z.object({
  profile: z.object({
    bio: z.string().max(2000).nullable().optional(),
    specialties: z.array(z.string()).optional().default([]),
    years_experience: z.number().int().min(0).max(60).nullable().optional(),
  }),
  packages: z.array(packageSchema).optional().default([]),
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verify coach role
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role !== "coach") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    // Get coach profile country for min price validation
    const { data: coachProfile } = await supabase
      .from("coach_profiles")
      .select("country, id")
      .eq("user_id", user.id)
      .single();

    if (!coachProfile) {
      return NextResponse.json(
        { error: "Perfil de coach no encontrado" },
        { status: 404 }
      );
    }

    // Get min price from country_config
    const { data: countryConfig } = await supabase
      .from("country_config")
      .select("min_coach_price")
      .eq("country", coachProfile.country)
      .single();

    const minCoachPrice = countryConfig?.min_coach_price ?? 0;

    const body: unknown = await request.json();
    const parsed = perfilSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { profile, packages } = parsed.data;

    // Validate package prices
    // Both minCoachPrice and pkg.price_cents are in centavos (country_config.min_coach_price)
    const activePackages = packages.filter((p) => !p._deleted);
    for (const pkg of activePackages) {
      if (pkg.price_cents < minCoachPrice) {
        const minDisplay = (minCoachPrice / 100).toLocaleString("es-AR");
        return NextResponse.json(
          {
            error: `El precio mínimo es ${minDisplay}. El paquete "${pkg.name}" está por debajo del mínimo.`,
          },
          { status: 400 }
        );
      }
    }

    // Update coach_profiles
    const { error: profileError } = await supabase
      .from("coach_profiles")
      .update({
        bio: profile.bio ?? null,
        specialties: profile.specialties,
        years_experience: profile.years_experience ?? null,
      })
      .eq("user_id", user.id);

    if (profileError) {
      console.error("Error updating coach profile:", profileError);
      return NextResponse.json(
        { error: "Error al actualizar el perfil" },
        { status: 500 }
      );
    }

    // Handle packages — always use coach_profiles.id (not auth user id)
    const coachProfileId = coachProfile.id;
    for (const pkg of packages) {
      if (pkg._deleted && pkg.id) {
        // Soft delete: mark as inactive
        await supabase
          .from("coach_packages")
          .update({ active: false })
          .eq("id", pkg.id)
          .eq("coach_id", coachProfileId);
        continue;
      }

      if (pkg.id) {
        // Update existing
        await supabase
          .from("coach_packages")
          .update({
            title: pkg.name,
            description: pkg.description ?? null,
            price: pkg.price_cents,
            active: pkg.is_active,
          })
          .eq("id", pkg.id)
          .eq("coach_id", coachProfileId);
      } else if (!pkg._deleted) {
        // Insert new
        await supabase.from("coach_packages").insert({
          coach_id: coachProfileId,
          title: pkg.name,
          description: pkg.description ?? null,
          price: pkg.price_cents,
          tier: "starter" as const,
          active: pkg.is_active,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
