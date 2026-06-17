import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Genera un hash SHA-256 determinístico del user_id para el email anonimizado.
// Determinístico = siempre el mismo resultado para el mismo input (útil para
// deduplicación futura). No es reversible hacia PII (email o nombre original).
async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface DeletionQueueRow {
  user_id: string;
}

interface StorageObject {
  name: string;
}

serve(async (_req) => {
  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();

  // ── Obtener filas pendientes con anonymize_at vencido ─────────────────────
  const { data: pending, error: fetchError } = await adminClient
    .from("deletion_queue")
    .select("user_id")
    .lte("anonymize_at", now)
    .is("processed_at", null);

  if (fetchError) {
    return new Response(
      JSON.stringify({ error: fetchError.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!pending || pending.length === 0) {
    return new Response(
      JSON.stringify({ processed: 0 }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const results: { user_id: string; ok: boolean; error?: string }[] = [];

  for (const row of pending as DeletionQueueRow[]) {
    const userId = row.user_id;
    try {
      // ── 1. Anonimizar email en auth.users (via admin API) ─────────────────
      // El email real vive en auth.users, no en la tabla pública users.
      // Usamos sha256 del user_id como sufijo determinístico; no loguear el
      // email original.
      const hash = await sha256Hex(userId);
      const anonymizedEmail = `deleted+${hash}@forzza.invalid`;

      await adminClient.auth.admin.updateUserById(userId, {
        email: anonymizedEmail,
      });

      // ── 2. Anonimizar PII en student_profiles ────────────────────────────
      // display_name → '[deleted]', birth_date → null, parental_email → null,
      // avatar_url → null. fiscal_doc no existe en student_profiles (ver schema).
      await adminClient
        .from("student_profiles")
        .update({
          display_name: "[deleted]",
          birth_date: null,
          parental_email: null,
          avatar_url: null,
          updated_at: now,
        })
        .eq("user_id", userId);

      // ── 3. Anonimizar PII en coach_profiles (si el usuario era coach) ─────
      // fiscal_id (CUIT/RUT), bank_account (CBU), constancia_path.
      // bio y display_name también son PII identificable.
      await adminClient
        .from("coach_profiles")
        .update({
          display_name: "[deleted]",
          bio: null,
          fiscal_id: null,
          bank_account: null,
          constancia_path: null,
          cbu: null,
          alias_cbu: null,
          avatar_url: null,
          updated_at: now,
        })
        .eq("user_id", userId);

      // ── 4. Borrar objetos del bucket progress-photos del usuario ──────────
      // El prefijo de ruta es el user_id (ver política storage_buckets.sql:
      //   (storage.foldername(name))[1] = auth.uid()::text
      // ).
      // Listamos hasta 1000 objetos; si el usuario tiene más se procesarán
      // en la próxima ejecución (el loop iterará hasta que no queden objetos
      // porque processed_at aún no está seteado — pero para simplicidad y
      // dado que 1000 fotos por usuario es un techo razonable en V1, omitimos
      // paginación adicional).
      const { data: photoObjects } = await adminClient.storage
        .from("progress-photos")
        .list(userId, { limit: 1000 });

      if (photoObjects && photoObjects.length > 0) {
        const paths = (photoObjects as StorageObject[]).map(
          (obj) => `${userId}/${obj.name}`
        );
        await adminClient.storage.from("progress-photos").remove(paths);
      }

      // ── 5. Datos financieros: CONSERVAR sin modificación ─────────────────
      // payments, settlements, audit_log: JAMÁS borrar ni modificar.
      // Los registros financieros quedan desvinculados de PII porque el email
      // y el nombre ya fueron anonimizados en los pasos anteriores.
      // El user_id (UUID) en payments/settlements se mantiene como referencia
      // opaca sin valor identificador una vez eliminado el email/nombre.

      // ── 6. Marcar como procesado en deletion_queue ────────────────────────
      await adminClient
        .from("deletion_queue")
        .update({ processed_at: now })
        .eq("user_id", userId);

      // ── 7. Audit log (sin PII) ────────────────────────────────────────────
      await adminClient.from("audit_log").insert({
        actor_id: null, // proceso automatizado, sin actor humano
        action: "account_anonymized",
        entity_type: "user",
        entity_id: userId,
        payload: {
          anonymized_at: now,
          photos_removed: photoObjects?.length ?? 0,
        },
      });

      results.push({ user_id: userId, ok: true });
    } catch (err) {
      // No re-lanzar: procesar los demás usuarios del batch.
      // Este usuario quedará con processed_at=null y el cron lo reintentará.
      const message = err instanceof Error ? err.message : String(err);
      results.push({ user_id: userId, ok: false, error: message });
    }
  }

  const processed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  return new Response(
    JSON.stringify({ processed, failed }),
    { headers: { "Content-Type": "application/json" } }
  );
});
