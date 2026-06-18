-- exercise_videos.sql — GENERADO por scripts/build-exercise-videos.ts
-- NO editar a mano. Fuente acumulada: supabase/seed/exercise_videos.json
-- Regenerar con: pnpm videos:generate

BEGIN;

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.732, '{"text":0.3333333333333333,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'mMieHCr-H0c', '5 MINUTOS DE ABDOMINALES INTENSOS', 'UCfwP2H1CDJvssk6g2pm8EgA', 'gymvirtual', 332, 0.7383, '{"text":0.5,"channel":1,"engagement":0.6914995892224931,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.732, '{"text":0.3333333333333333,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'H_ADCsf0JOw', 'COMO ENTRENAR EL FEMORAL CORRECTAMENTE EN MAQUINA', 'UCgZN9Cgort7WQgi9AlEJDZw', 'FHI.ONLINE', 217, 0.4236, '{"text":0.3333333333333333,"channel":0,"engagement":0.6179710239809797,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'ab-crunch-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vi1-BOcj3cQ', 'Are You Doing Dips Properly? (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 303, 0.7713, '{"text":0.3333333333333333,"channel":1,"engagement":0.8563254921614221,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'assisted-dips-cable'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'd8IEGU9BrLU', 'Por ESTO te Cuesta Hacer los FONDOS en Paralelas | Técnica REAL aquí', 'UCLNaMWbEx9fa4V6oe5wxEkA', 'PRO-BARRAS', 343, 0.5658, '{"text":0.5,"channel":0,"engagement":0.8289952873324032,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'assisted-dips-cable'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vKpqOpjJt18', '9 Assisted Pull Up Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 922, 0.7248, '{"text":0.75,"channel":1,"engagement":0.748767675313415,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'lgE47t3dr2Q', 'DOMINADAS Asistidas en MÁQUINA TUTORIAL', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 135, 0.6312, '{"text":1,"channel":0,"engagement":0.6561611984455199,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'vKpqOpjJt18', '9 Assisted Pull Up Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 922, 0.7248, '{"text":0.75,"channel":1,"engagement":0.748767675313415,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'lgE47t3dr2Q', 'DOMINADAS Asistidas en MÁQUINA TUTORIAL', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 135, 0.5312, '{"text":0.6666666666666666,"channel":0,"engagement":0.6561611984455199,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'assisted-pull-up-machine-2'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'UYJsFzqdgK4', 'HOW TO: Close-Grip Bench Press (TRICEPS BUILDER) || PERFECT FORM', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 177, 0.8197, '{"text":0.8,"channel":1,"engagement":0.6485522565099342,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-barbell-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'jlFl7WJ1TzI', 'Cómo hacer press de banca CORRECTAMENTE para incrementar tus músculos (5 pasos sencillos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.706, '{"text":0.4,"channel":1,"engagement":0.836717130625341,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-barbell-bench-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '8np3vKDBJfc', 'The PERFECT Deadlift (5 Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 57, 0.9452, '{"text":1,"channel":1,"engagement":0.9761348978804497,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'deadlift'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '7Sjfm61-HC4', 'Cómo hacer peso muerto CORRECTAMENTE para crecimiento (5 sencillos pasos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.8835, '{"text":1,"channel":1,"engagement":0.8242120782360775,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'deadlift'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'Did01dFR3Lk', 'Dumbbell Overhead Press - How To', 'UCSzAriYndMjGjJciDYyj47w', 'Bobby Maximus', 27, 0.6043, '{"text":1,"channel":0,"engagement":0.6214331697172865,"duration":0.8,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-overhead-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', 'CpvyRFjbgow', '¿Quieres unos hombros más grandes? 💪 Corrige tu press con estos 2 trucos sencillos! 🔧✨', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 25, 0.7644, '{"text":0.6666666666666666,"channel":1,"engagement":0.7387658230584325,"duration":0.6666666666666666,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-overhead-press'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', 'CAwf7n6Luuc', 'How To: Lat Pulldown | 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 342, 0.943, '{"text":1,"channel":1,"engagement":0.714901746486262,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'lat-pulldown'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'es', '72q0tKij5uU', 'Cómo Hacer Jalón Para Dorsales ¡EVITA ERRORES!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 355, 0.7333, '{"text":0.3333333333333333,"channel":1,"engagement":0.9167272621279318,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'lat-pulldown'
ON CONFLICT (exercise_id, lang) DO UPDATE SET
  youtube_id = EXCLUDED.youtube_id,
  title = EXCLUDED.title,
  channel_id = EXCLUDED.channel_id,
  channel_title = EXCLUDED.channel_title,
  duration_seconds = EXCLUDED.duration_seconds,
  score = EXCLUDED.score,
  score_breakdown = EXCLUDED.score_breakdown,
  status = EXCLUDED.status,
  updated_at = now();

COMMIT;
