-- Fix: el bucket `invoices` tenía solo políticas de SELECT (coach ve las suyas,
-- owner ve todas) pero NINGUNA de INSERT/UPDATE. Por eso el coach no podía subir
-- su factura: la subida violaba RLS ("new row violates row-level security policy").
-- Los fixtures aparecían 'invoiced' porque el seed escribe con service role.
--
-- Patrón de carpeta usado por la route /api/coach/settlements/[id]/invoice:
--   {auth.uid()}/{settlementId}/{timestamp}.{ext}
-- => folder[1] = auth.uid(), igual que las políticas de SELECT existentes.

-- El coach sube facturas en SU propia carpeta
CREATE POLICY "invoices_coach_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- El coach puede reemplazar (upsert / re-subida tras rechazo) su propia factura
CREATE POLICY "invoices_coach_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Alinear los mime types del bucket con lo que aceptan la route y la UI
-- (PDF de la factura o foto de la misma).
UPDATE storage.buckets
  SET allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png']
  WHERE id = 'invoices';
