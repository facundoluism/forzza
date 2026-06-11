# Runbook — Base de datos (Supabase local y cloud)

## Prerrequisitos

- Docker Desktop instalado y corriendo.
- Supabase CLI instalado: `npm install -g supabase` (o `brew install supabase/tap/supabase` en Mac).
- Variables de entorno en `.env` (copiar de `.env.example` y completar).

---

## 1. Levantar Supabase local

```bash
# Desde la raíz del monorepo
supabase start
```

Esto levanta Postgres, Auth, Storage, Realtime y Studio en Docker.
La URL local por defecto es `http://localhost:54321`.
El studio (UI de administración) queda en `http://localhost:54323`.

Para detener:

```bash
supabase stop
```

Para detener y borrar todos los datos locales:

```bash
supabase stop --no-backup
```

---

## 2. Aplicar migraciones

Las migraciones viven en `supabase/migrations/`. Se aplican en orden de nombre de archivo.

```bash
# Aplicar solo las migraciones pendientes (sin borrar datos)
supabase db push

# Ver el estado de migraciones aplicadas
supabase migration list
```

Si hay conflictos o se necesita resetear desde cero, ver sección 4.

---

## 3. Seed completo (reset local)

El comando `pnpm db:reset` hace: reset de la DB + migraciones + seed.
**Borra todos los datos locales.**

```bash
pnpm db:reset
```

El seed (`supabase/seed.sql`) incluye:
- `country_config` para AR y CL con `commission_rate = 0.20`.
- 30 ejercicios base en `exercise_library`.
- Usuario de prueba dueño, coach aprobado y alumno (ver `seed.sql` para credenciales).

Para ejecutar solo el seed sin resetear:

```bash
supabase db reset --no-migration
```

---

## 4. Reset completo (elimina todo)

```bash
supabase db reset
```

Equivale a borrar la DB local y volver a aplicar todas las migraciones + seed desde cero.
Útil cuando las migraciones tienen conflictos o se cambió el schema sin crear una nueva migración.

---

## 5. Linkear al proyecto cloud

Necesario para sincronizar migraciones con el entorno de staging/producción.

```bash
# Obtener el ref del proyecto en supabase.com > Settings > General
supabase link --project-ref <PROJECT_REF>

# Verificar que el link está activo
supabase status
```

Una vez linkeado, `supabase db push` aplica las migraciones al proyecto cloud.
**No ejecutar `supabase db reset` contra producción.**

---

## 6. Regenerar tipos TypeScript

Los tipos de la DB viven en `packages/db-types/`. Regenerar cada vez que se cambien tablas o columnas.

```bash
pnpm db:types
```

Esto ejecuta `supabase gen types typescript` y sobrescribe el archivo de tipos.
Commitear el archivo regenerado junto con la migración que lo originó.

---

## 7. Ejecutar tests RLS

Los tests de Row Level Security usan pgTAP y viven en `supabase/tests/rls_test.sql`.

```bash
# Requiere supabase start activo
pnpm test:rls
```

Hay 23 assertions. Todos deben pasar antes de hacer deploy a producción.
Ver detalle de cada assertion en `docs/progress/F16-QA.md`.

---

## 8. Crear una nueva migración

```bash
supabase migration new <nombre_descriptivo>
# Ejemplo: supabase migration new add_promoter_table
```

Esto crea un archivo vacío en `supabase/migrations/`. Escribir el SQL de la migración en ese archivo.
Ejecutar `supabase db push` para aplicarla localmente y verificar que los tipos no cambian de forma inesperada.

---

## Problemas comunes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| `supabase start` falla con "port already in use" | Otro proceso usa el puerto 54321 | `supabase stop` primero; o cambiar puertos en `supabase/config.toml` |
| `pnpm db:types` genera tipos vacíos | DB local no está corriendo | Ejecutar `supabase start` primero |
| Migración falla con "column already exists" | Migración aplicada parcialmente | `supabase db reset` para empezar limpio |
| Tests RLS fallan con "function not found" | pgTAP no instalado en la instancia | `supabase db reset` reinstala extensiones del seed |
