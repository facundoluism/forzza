-- Habilitar Realtime para la tabla messages (chat alumno↔coach).
--
-- La pantalla de conversación (apps/mobile/app/chat/[conversationId].tsx) se
-- suscribe a `postgres_changes` (INSERT) sobre public.messages para mostrar los
-- mensajes nuevos en vivo. Si la tabla NO está en la publicación
-- `supabase_realtime`, los INSERT persisten pero el evento nunca llega: el
-- mensaje se guarda y no aparece en el chat. Esto agrega la tabla a la
-- publicación (idempotente).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

-- Índice para listar/paginar mensajes por conversación (assignment) sin scan.
CREATE INDEX IF NOT EXISTS idx_messages_assignment_created
  ON public.messages (assignment_id, created_at);
