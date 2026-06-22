-- exercise_videos.sql — GENERADO por scripts/build-exercise-videos.ts
-- NO editar a mano. Fuente acumulada: supabase/seed/exercise_videos.json
-- Regenerar con: pnpm videos:generate

BEGIN;

INSERT INTO public.exercise_videos (exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.782, '{"text":0.5,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
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
SELECT id, 'es', 'mMieHCr-H0c', '5 MINUTOS DE ABDOMINALES INTENSOS', 'UCfwP2H1CDJvssk6g2pm8EgA', 'gymvirtual', 332, 0.8883, '{"text":1,"channel":1,"engagement":0.691499543750374,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'en', '_O1xunCfYEM', 'How To: Abdominal Crunch (Hammer Strength)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.782, '{"text":0.5,"channel":1,"engagement":0.6600935925682645,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
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
SELECT id, 'en', 'vKpqOpjJt18', '9 Assisted Pull Up Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 922, 0.7998, '{"text":1,"channel":1,"engagement":0.748767675313415,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'en', 'vKpqOpjJt18', '9 Assisted Pull Up Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 922, 0.7998, '{"text":1,"channel":1,"engagement":0.748767675313415,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'es', 'npyLB-7o19o', 'Desbloquea tus primeras DOMINADAS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 285, 0.5371, '{"text":0.5,"channel":0,"engagement":0.935475783925844,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', 'nAcG01Pe0Nc', 'His Back Extension Is CRAZY!🤯', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 58, 0.7931, '{"text":0.5,"channel":1,"engagement":0.965536717557942,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'back-extension-incline-bench'
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
SELECT id, 'es', 'aYGRgupuBdw', 'Domina el Crunch en Banco Declinable paso a paso', 'UCDQT-KZuuJ_PMR58nuYGLTg', 'MH Entrenamiento - Mr. Glúteo', 43, 0.4494, '{"text":0.25,"channel":0,"engagement":0.8721387520991565,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'back-extension-incline-bench'
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
SELECT id, 'en', 'H8Swl1N-uis', 'STOP Doing Back Extensions Like This!', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 220, 0.7513, '{"text":0.5,"channel":1,"engagement":0.7564951654761372,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'back-extension-machine'
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
SELECT id, 'es', 'khhAS-FT_A0', 'Cómo desarrollar tu espalda con solo 3 ejercicios 💪', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 58, 0.7452, '{"text":0.3333333333333333,"channel":1,"engagement":0.9758232977124582,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'back-extension-machine'
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
SELECT id, 'en', 'p9RihhjmJsw', 'How to Execute a Bent Over Row', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 37, 0.8553, '{"text":0.75,"channel":1,"engagement":0.9014903314474473,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-bent-over-row'
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
SELECT id, 'es', '2J61UenaFRw', 'Así debes hacer el remo con barra', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 60, 0.9388, '{"text":1,"channel":1,"engagement":0.9438757973324629,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-bent-over-row'
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
SELECT id, 'en', 'QZEqB6wUPxQ', 'How To: Barbell Bicep Curl | 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 370, 0.9439, '{"text":1,"channel":1,"engagement":0.733142662135272,"duration":0.9722222222222222,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-bicep-curl'
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
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.6822, '{"text":1,"channel":0,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-bicep-curl'
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
SELECT id, 'en', '7D96dK6oaP8', 'Core Stability: Side  Bends or Suitcase Carry? |#AskSquatU Show Ep. 47|', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 399, 0.6953, '{"text":0.3333333333333333,"channel":1,"engagement":0.7806210002732704,"duration":0.8916666666666667,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-side-bend'
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
SELECT id, 'en', 'q1fCgfieNEs', 'The SINGLE BEST Squat Tip I’ve Ever Used!', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 317, 0.8061, '{"text":0.5,"channel":1,"engagement":0.7802978109547658,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-squat'
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
SELECT id, 'es', 'MnQ6MsoPHks', 'Como hacer la sentadilla correctamente | técnica para glúteos y para piernas', 'UC_zaLJ30yLlq5Pd86jdu_Og', 'NAYLA Vlogs', 161, 0.6858, '{"text":1,"channel":0,"engagement":0.9288387713541474,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-squat'
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
SELECT id, 'en', 'LdhWBp5lWqc', 'How To: Standing Oblique Twists with Bar', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 100, 0.7442, '{"text":0.4,"channel":1,"engagement":0.620928210950356,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-twists-russian-twist-with-bar'
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
SELECT id, 'es', 'wThd4GBGbQc', 'EJERCICIOS ABDOMINALES PROHIBIDOS - Ejercicios para abdomen: Giros con pica', 'UCjGVbMdksC7kagTniVQfoPQ', 'FitCook', 169, 0.6709, '{"text":1,"channel":0,"engagement":0.8545557159243243,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-twists-russian-twist-with-bar'
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
SELECT id, 'en', 'amCU-ziHITM', 'How To: Barbell Upright Row', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 173, 0.9266, '{"text":1,"channel":1,"engagement":0.6331033488939187,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'barbell-upright-row'
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
SELECT id, 'es', 'loL670Yb7nU', 'HOMBRO y TRAPECIO GRANDES - Remo al mentón (mi ejercicio estrella)', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 257, 0.697, '{"text":0.3333333333333333,"channel":1,"engagement":0.7351709815570052,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'barbell-upright-row'
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
SELECT id, 'en', '0cXAp6WhSj4', 'The PERFECT Bench Press (5 Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 58, 0.8475, '{"text":0.6666666666666666,"channel":1,"engagement":0.9875202653298837,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bench-press-barbell'
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
SELECT id, 'es', 'jlFl7WJ1TzI', 'Cómo hacer press de banca CORRECTAMENTE para incrementar tus músculos (5 pasos sencillos)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 473, 0.886, '{"text":1,"channel":1,"engagement":0.836717130625341,"duration":0.6861111111111111,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bench-press-barbell'
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
SELECT id, 'en', 'ttvfGg9d76c', 'How To: Dumbbell Bent-Over Raise', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 102, 0.7483, '{"text":0.4,"channel":1,"engagement":0.6413830764176844,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bent-over-rear-delt-fly'
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
SELECT id, 'es', 'JfMF84StvGo', 'PÁJARO de PIE con MANCUERNAS | ELEVACIONES POSTERIORES', 'UC3Rn-AuuDMQZAsVqaUrd8hg', 'APTA Vital Sport', 108, 0.5442, '{"text":0.75,"channel":0,"engagement":0.5962342711780682,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'bent-over-rear-delt-fly'
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
SELECT id, 'en', 'M_uPvGrMx_o', 'How To: Arm Curl (Cybex)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 100, 0.7757, '{"text":0.5,"channel":1,"engagement":0.6283598782801877,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'bicep-curl-machine'
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
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.6822, '{"text":1,"channel":0,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'bicep-curl-machine'
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
SELECT id, 'en', 'AsAVbj7puKo', 'How To: Outside Grip Cable EZ-Curls (LF Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.7261, '{"text":0.3333333333333333,"channel":1,"engagement":0.6303190772830736,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl'
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
SELECT id, 'es', 'fx9VW2lDx_s', 'Curl de bíceps con soga en polea baja', 'UC_9_CYb4vxMPYMosJv1u0ZA', 'Abdias Sadrac', 67, 0.6161, '{"text":1,"channel":0,"engagement":0.5807151263440884,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl'
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
SELECT id, 'en', 'AsAVbj7puKo', 'How To: Outside Grip Cable EZ-Curls (LF Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.7461, '{"text":0.4,"channel":1,"engagement":0.6303190772830736,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-ez-bar'
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
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8122, '{"text":0.6,"channel":1,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-ez-bar'
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
SELECT id, 'en', 'AsAVbj7puKo', 'How To: Outside Grip Cable EZ-Curls (LF Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.6861, '{"text":0.2,"channel":1,"engagement":0.6303190772830736,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-straight-bar'
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
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8122, '{"text":0.6,"channel":1,"engagement":0.9111993360398396,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-bicep-curl-straight-bar'
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
SELECT id, 'en', '8Um35Es-ROE', 'How To: Cable Fly (High-To-Low) || 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 233, 0.7697, '{"text":0.6,"channel":1,"engagement":0.6986761352253078,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-chest-fly-low-pulley'
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
SELECT id, 'es', 'OtW0EYqBczI', 'Cómo hacer APERTURAS, el ejercicio BÁSICO de toda rutina de pecho #gym #aperturas  #pecho', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.7115, '{"text":0.25,"channel":1,"engagement":0.9325432507665611,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-chest-fly-low-pulley'
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
SELECT id, 'en', 'JUDTGZh4rhg', 'STOP F*cking Up Cable Flys (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 411, 0.7012, '{"text":0.3333333333333333,"channel":1,"engagement":0.8270092122286649,"duration":0.8583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-chest-press'
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
SELECT id, 'es', 'WNtBIde3Qks', 'Deja de Arruinar El Cruce de Poleas PECHO ¡FORMA CORRECTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 411, 0.9237, '{"text":1,"channel":1,"engagement":0.9392076314697476,"duration":0.8583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-crossover'
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
SELECT id, 'en', '8Um35Es-ROE', 'How To: Cable Fly (High-To-Low) || 3 GOLDEN RULES', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 233, 0.8147, '{"text":0.75,"channel":1,"engagement":0.6986761352253078,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-crossover-high-to-low'
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
SELECT id, 'es', 'XuQWMR4QKF0', 'Cómo hacer CRUNCH en polea', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 57, 0.9255, '{"text":1,"channel":1,"engagement":0.8773220347686083,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-crunch'
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
SELECT id, 'en', 'AV5PmZJIrrw', 'How to PROPERLY Cable Crunch to Shape Your Abs (How to Kneeling Cable Abdominal Crunch)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 292, 0.6414, '{"text":1,"channel":0,"engagement":0.7072430779388895,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-crunch-kneeling'
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
SELECT id, 'es', '4cbp_LG63qE', 'NO hagas así las ABDUCCIONES en POLEA [sobre todo si eres principiante]', 'UCMJwz5wPzC4QcsLTQMAKxPQ', 'Trainologym', 58, 0.4721, '{"text":0.3333333333333333,"channel":0,"engagement":0.8603962509198225,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-crunch-kneeling'
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
SELECT id, 'en', 'ljgqer1ZpXg', 'STOP F*cking Up Face Pulls (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 382, 0.7492, '{"text":0.3333333333333333,"channel":1,"engagement":0.7766645318063644,"duration":0.9388888888888889,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-face-pull'
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
SELECT id, 'es', 'UaZPhyztYNU', 'FACE PULL Polea Alta. Ejercicio de Hombro Posterior', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 72, 0.8708, '{"text":1,"channel":1,"engagement":0.6037567553606981,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-face-pull'
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
SELECT id, 'en', '91m1yw-oiac', 'Cable Rope Front Raise the RIGHT way💪🏽🔥#shoulder #shoulderworkout #delts #cableworkout #gymtips', 'UClFCCX0OA6qqTRlxzTeSwrA', 'QuanBFit', 94, 0.6376, '{"text":1,"channel":0,"engagement":0.6881244549177407,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-front-raise'
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
SELECT id, 'es', 'zUf3fJjdCig', 'Elevación frontal de HOMBRO en Polea Baja. Ejercicio de hombros frontal', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 113, 0.8437, '{"text":1,"channel":1,"engagement":0.4686184502136278,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-front-raise'
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
SELECT id, 'en', '91m1yw-oiac', 'Cable Rope Front Raise the RIGHT way💪🏽🔥#shoulder #shoulderworkout #delts #cableworkout #gymtips', 'UClFCCX0OA6qqTRlxzTeSwrA', 'QuanBFit', 94, 0.6376, '{"text":1,"channel":0,"engagement":0.6881244549177407,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-front-raise-2'
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
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.7237, '{"text":0.5,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-front-raise-2'
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
SELECT id, 'en', '5jJNfIlKTmg', 'How to PROPERLY Cable Glute Kickback (GROW YOUR GLUTES)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 192, 0.6231, '{"text":1,"channel":0,"engagement":0.6153491305365993,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback'
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
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.7737, '{"text":0.6666666666666666,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback'
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
SELECT id, 'en', '5jJNfIlKTmg', 'How to PROPERLY Cable Glute Kickback (GROW YOUR GLUTES)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 192, 0.6231, '{"text":1,"channel":0,"engagement":0.6153491305365993,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback-2'
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
SELECT id, 'es', 'ZRQAzrzE8_A', 'Glúteos más notorios usando polea 😍', 'UC2ZFIs_x0vtyrwdXGg8b9Sw', 'FRANK SERAPIÓN', 367, 0.5041, '{"text":0.5,"channel":0,"engagement":0.7801779586013774,"duration":0.9805555555555555,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-glute-kickback-2'
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
SELECT id, 'en', '4cxt_Tldugw', '9 Hack Squat Mistakes and How to Fix Them', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 1127, 0.7095, '{"text":0.6666666666666666,"channel":1,"engagement":0.7973039938991753,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-hack-squat'
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
SELECT id, 'es', 'XusYaOMftMA', 'BICEPS - CURL MARTILLO POLEA', 'UCZ0We59vomlVrHdBPFGOFzQ', 'Rodrigo Metabolico', 42, 0.5367, '{"text":1,"channel":0,"engagement":0.4335319025927512,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hammer-curl'
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
SELECT id, 'en', 'pvnR8CDb4BU', 'How to Do Cable Hip Abduction Exercise', 'UCE8wCVw_ZfRw-D6RJ5EXWbw', 'LIVESTRONG', 91, 0.631, '{"text":1,"channel":0,"engagement":0.6551424694708277,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-abduction'
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
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.6737, '{"text":0.3333333333333333,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-abduction'
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
SELECT id, 'en', 'GmRSV_n2E_0', 'How To: Hip Adduction (Cybex)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 139, 0.8276, '{"text":0.6666666666666666,"channel":1,"engagement":0.6382416391720735,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-hip-adduction'
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
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.6737, '{"text":0.3333333333333333,"channel":1,"engagement":0.618357685806107,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-adduction'
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
SELECT id, 'es', 'OmhY5_tVzt0', 'Pull Through Polea Baja con Cuerdas. Técnica para GLÚTEO', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 134, 0.6737, '{"text":0.3333333333333333,"channel":1,"engagement":0.618377674771098,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-extension'
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
SELECT id, 'en', '7_cK3XVqN9M', 'Train Your Damn Hip Flexors!', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 60, 0.67, '{"text":0.3333333333333333,"channel":1,"engagement":0.6,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-flexion'
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
SELECT id, 'es', 'mSejp5qK1pc', 'Ofit Live Tips - Abdominales: elevación de piernas y flexión de cadera', 'UCbF4xrC5aGWtLCcGKLD2wOQ', 'Ofit Live', 194, 0.4264, '{"text":0.3333333333333333,"channel":0,"engagement":0.6321090398805866,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-hip-flexion'
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
SELECT id, 'en', 'JUDTGZh4rhg', 'STOP F*cking Up Cable Flys (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 411, 0.7012, '{"text":0.3333333333333333,"channel":1,"engagement":0.8269676264639171,"duration":0.8583333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-incline-press'
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
SELECT id, 'es', '-zbesyTNztQ', 'Cómo hacer press INCLINADO, el ejercicio BÁSICO de toda rutina de pecho #gym #pressinclinado  #pecho', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 46, 0.8407, '{"text":0.6666666666666666,"channel":1,"engagement":0.9534715512080268,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-incline-press'
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
SELECT id, 'en', 'GxDF2AYsI1Q', 'Cable Shoulder External Rotation', 'UC2dLsLMA7Fst_bpJkoRxHJQ', 'Physio Plus Fitness', 50, 0.4608, '{"text":0.6666666666666666,"channel":0,"engagement":0.5540275891580435,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-internal-rotation'
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
SELECT id, 'es', 'DplyMccjRrE', '🟢ROTACIONES EXTERNAS de Hombro en Polea: ✅ Técnica PERFECTA y SEGURA', 'UCBhk0wiI7HzF3kg-WLYXgoQ', 'Vitar Club', 76, 0.5425, '{"text":0.6666666666666666,"channel":0,"engagement":0.4624781895895189,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-internal-rotation'
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
SELECT id, 'en', 'f_OGBg2KxgY', 'Stop Messing Up Lateral Raises (Easy Fix)', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 44, 0.735, '{"text":0.3333333333333333,"channel":1,"engagement":0.9251504924407427,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise'
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
SELECT id, 'es', '2Quux2aZodo', '¿Cuál Elevación es MEJOR para Hombros Grandes? ¡ES ESTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 390, 0.7316, '{"text":0.3333333333333333,"channel":1,"engagement":0.9496580927434991,"duration":0.9166666666666666,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise'
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
SELECT id, 'en', 'f_OGBg2KxgY', 'Stop Messing Up Lateral Raises (Easy Fix)', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 44, 0.71, '{"text":0.25,"channel":1,"engagement":0.9251504924407427,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise-single'
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
SELECT id, 'es', 'gjUrYfNU1-M', 'Elevación Lateral Hombro Unilateral Polea Baja', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 30, 0.6561, '{"text":0.5,"channel":1,"engagement":0.530400282383737,"duration":1,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-lateral-raise-single'
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
SELECT id, 'en', '2MUEL4nL6hA', 'How to PROPERLY Cable Bicep Curl For Bigger Biceps (EASY FIX)', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 73, 0.5412, '{"text":0.75,"channel":0,"engagement":0.5807842228776134,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-overhead-bicep-curl'
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
SELECT id, 'es', 'de_Xc1AKulo', 'Bíceps Bayesian. Curl de Bíceps en Polea Baja', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 113, 0.7404, '{"text":0.6,"channel":1,"engagement":0.5519718603050862,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-overhead-bicep-curl'
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
SELECT id, 'en', 'GzmlxvSFE7A', 'How to PROPERLY Overhead Cable Tricep Extension | Fix Your Tricep Extension Form NOW!', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 223, 0.6336, '{"text":1,"channel":0,"engagement":0.6680151247622286,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-overhead-tricep-extension'
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
SELECT id, 'es', 'P40-DvgM9qI', 'Tríceps Tras nuca en Polea Baja - Extensión de tríceps sobre la cabeza', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 118, 0.8574, '{"text":1,"channel":1,"engagement":0.536797711769613,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-overhead-tricep-extension'
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
SELECT id, 'en', 'YWfioXCZCu0', 'Cable Pallof Press', 'UCO1Jc6PEQIbFc1c2y1bh85Q', 'UVM Campus Recreation', 32, 0.6215, '{"text":1,"channel":0,"engagement":0.6075527554679038,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-pallof-press'
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
SELECT id, 'es', 'c-byXbLkWzY', 'Press Pallof con Banda o Polea / Ejercicio de Core isométrico', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 98, 0.853, '{"text":1,"channel":1,"engagement":0.5152424356192058,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-pallof-press'
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
SELECT id, 'en', 'pv8e6OSyETE', 'Cable Pull Through', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 11, 0.717, '{"text":1,"channel":1,"engagement":0.5850047028489198,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-pull-through'
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
SELECT id, 'es', '72q0tKij5uU', 'Cómo Hacer Jalón Para Dorsales ¡EVITA ERRORES!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 355, 0.7083, '{"text":0.25,"channel":1,"engagement":0.9167190989308124,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-pull-through'
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
SELECT id, 'en', 'zEuseRjS7vg', 'What Is The Best Rear Delt Exercise?', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 56, 0.7597, '{"text":0.5,"channel":1,"engagement":0.7984086345545253,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly'
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
SELECT id, 'es', 'xhmvKbKq5as', 'El mejor ejercicio para deltoides posterior con mancuernas #deltoidesposterior #tips', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 43, 0.7853, '{"text":0.5,"channel":1,"engagement":0.9265648454432472,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly'
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
SELECT id, 'en', 'zEuseRjS7vg', 'What Is The Best Rear Delt Exercise?', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 56, 0.7297, '{"text":0.4,"channel":1,"engagement":0.7984086345545253,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly-single'
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
SELECT id, 'es', 'evJBZ_8-2ik', 'PARA de Hacer Remo a una Mano Así ¡SALVA A UN AMIGO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 30, 0.7493, '{"text":0.3333333333333333,"channel":1,"engagement":0.9964731031195392,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-rear-delt-fly-single'
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
SELECT id, 'en', 'YykmcX2b-LY', 'Cable Shrug', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 9, 0.7142, '{"text":1,"channel":1,"engagement":0.570831856477169,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-shrug'
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
SELECT id, 'es', 'mqTvt5xLFIY', 'Encogimiento de Trapecio En POLEA I Explicación Completa I Sergio Tejeda', 'UCY47VIwbDJVY8xH5wdLsRyA', 'Sergio Tejeda', 324, 0.5844, '{"text":1,"channel":0,"engagement":0.4220146848318936,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-shrug'
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
SELECT id, 'en', 'G9uNaXGTJ4w', 'Straight Arm Pulldown', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 12, 0.6485, '{"text":0.75,"channel":1,"engagement":0.6173625082152338,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown'
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
SELECT id, 'es', '3e-76jcA91w', 'Cómo hacer Jalón de Pecho PERFECTO! Vídeo completo en la descripción #espalda #consejos #gym', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.7186, '{"text":0.25,"channel":1,"engagement":0.9680388920802042,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown'
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
SELECT id, 'en', 'G9uNaXGTJ4w', 'Straight Arm Pulldown', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 12, 0.6485, '{"text":0.75,"channel":1,"engagement":0.6173625082152338,"duration":0,"language":0.5,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown-2'
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
SELECT id, 'es', '-UrSFw0QPHs', 'PULL OVER con CUERDA en Polea Alta', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 131, 0.8717, '{"text":1,"channel":1,"engagement":0.6086326950551145,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-straight-arm-pulldown-2'
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
SELECT id, 'en', 'Nm3M-4fmprk', 'Jeff Nippard Taught Me the Perfect T-Bar Row! #gym', 'UCxiub44lXA3uQg_OaA9yheg', 'Jesse James East', 30, 0.5783, '{"text":0.75,"channel":0,"engagement":0.7666969826737708,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-t-bar-row'
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
SELECT id, 'es', 'I3Wi6GK0QMk', 'La técnica correcta del Remo gironda', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 38, 0.7304, '{"text":0.3333333333333333,"channel":1,"engagement":0.9017920160794399,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-t-bar-row'
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
SELECT id, 'en', 'mYBqEj6A648', 'Cable Tricep Kickback the RIGHT way💪🏽🔥#triceps #tricepsworkout #armday #armworkout #gymtips', 'UClFCCX0OA6qqTRlxzTeSwrA', 'QuanBFit', 116, 0.6566, '{"text":1,"channel":0,"engagement":0.7830473842623754,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-tricep-kickback'
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
SELECT id, 'es', 'xfS2-dkcC1k', 'Haz crecer tu TRÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 304, 0.7448, '{"text":0.3333333333333333,"channel":1,"engagement":0.973914682472356,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-kickback'
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
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8524, '{"text":0.75,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-bar'
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
SELECT id, 'es', 'p-kdPTKDgNs', '✅ Cómo hacer CRUNCH en POLEA correctamente (Abdominales)', 'UCmxJ8pGMAEgj1CKxQX4R4xw', 'Fit Generation', 27, 0.4888, '{"text":0.5,"channel":0,"engagement":0.793950262968031,"duration":0.8,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-bar'
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
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8524, '{"text":0.75,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope'
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
SELECT id, 'es', 'uZg6VtRhwQY', 'Tríceps en Polea con Cuerdas / Tips Claves', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 77, 0.7056, '{"text":0.5,"channel":1,"engagement":0.5282445948398755,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope'
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
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8524, '{"text":0.75,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope-2'
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
SELECT id, 'es', 'uZg6VtRhwQY', 'Tríceps en Polea con Cuerdas / Tips Claves', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 77, 0.6556, '{"text":0.3333333333333333,"channel":1,"engagement":0.5282445948398755,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-rope-2'
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
SELECT id, 'en', '2-LAMcpzODU', 'How To: Tricep Pushdown (Life Fitness Cable)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 112, 0.8074, '{"text":0.6,"channel":1,"engagement":0.6370295346180331,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-straight-bar'
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
SELECT id, 'es', 'VpcU-jQ3BWs', 'Haces Triceps con Barra o con Cuerdas?  #gym #triceps  #tips', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 33, 0.7815, '{"text":0.5,"channel":1,"engagement":0.9075713681168934,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-tricep-pushdown-straight-bar'
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
SELECT id, 'en', 'V3h_1IUY-f0', 'Master The Controversial Upright Row | Targeting The Muscle', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 463, 0.7877, '{"text":0.6666666666666666,"channel":1,"engagement":0.8313151143589083,"duration":0.7138888888888889,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-upright-row'
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
SELECT id, 'es', 'WtBBR799JLk', 'Remo al mentón con CUERDA en POLEA BAJA', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 76, 0.8446, '{"text":1,"channel":1,"engagement":0.47287294097435284,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-upright-row'
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
SELECT id, 'en', 'V3h_1IUY-f0', 'Master The Controversial Upright Row | Targeting The Muscle', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 463, 0.7877, '{"text":0.6666666666666666,"channel":1,"engagement":0.8313151143589083,"duration":0.7138888888888889,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-upright-row-2'
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
SELECT id, 'es', 'fNyq2d1MslE', '🔥¿Cómo Tener Un Cuello Ancho Para Ser Más Atractivo Y Atlético? Guía Basada En Ciencia + Rutina 🧠', 'UCJQ_Yp6hlm65IAAeonc1QEA', 'Legionarios Élite', 80, 0.4668, '{"text":0.25,"channel":0,"engagement":0.9590610513941161,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-upright-row-2'
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
SELECT id, 'en', 'pAplQXk3dkU', 'How To: Oblique Twist "Wood Chopper" (LF CAble)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 194, 0.8332, '{"text":0.6666666666666666,"channel":1,"engagement":0.6661981233180451,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'cable-wood-chop'
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
SELECT id, 'es', 'y8Qhx_ebcas', 'Pomo de hacha secreto, God Of War 4 (new game +)', 'UC84ifY6o47vD8ueKmuzOvIA', 'VigozPlay', 14, 0.346, '{"text":0.3333333333333333,"channel":0,"engagement":0.7300183594491657,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'cable-wood-chop'
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
SELECT id, 'en', 'nDh_BlnLCGc', 'How To Leg Press With Perfect Technique', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 59, 0.85, '{"text":0.6666666666666666,"channel":1,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'calf-press-on-leg-press'
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
SELECT id, 'es', 'EptZC_AY6fE', 'Gemelo En Prensa con TIPS CLAVES - Extensiones de GEMELOS', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 106, 0.8477, '{"text":1,"channel":1,"engagement":0.48865563550975455,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'calf-press-on-leg-press'
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
SELECT id, 'en', 'M2UuuyJ2tCg', 'Captain’s Chair Leg Raises : How to engage your core properly and avoiding lower back strain.', 'UCCvbos_dgQPr_hRF9xbuHtw', 'HurricaneGH', 60, 0.6276, '{"text":0.8,"channel":0,"engagement":0.9381186484679723,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'captains-chair-leg-raise'
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
SELECT id, 'es', 'mSejp5qK1pc', 'Ofit Live Tips - Abdominales: elevación de piernas y flexión de cadera', 'UCbF4xrC5aGWtLCcGKLD2wOQ', 'Ofit Live', 194, 0.4764, '{"text":0.5,"channel":0,"engagement":0.6321090398805866,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'captains-chair-leg-raise'
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
SELECT id, 'en', 'xUm0BiZCWlQ', 'How To: Chest Press (Cybex)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 158, 0.9314, '{"text":1,"channel":1,"engagement":0.6571266945722625,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'chest-press-machine'
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
SELECT id, 'es', 'TAH8RxOS0VI', 'Cómo hacer PRESS DE BANCA perfecto', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 190, 0.7862, '{"text":0.5,"channel":1,"engagement":0.9310297767796961,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'chest-press-machine'
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
SELECT id, 'en', 'nEF0bv2FW94', 'How To: Close-Grip Barbell Bench Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 96, 0.928, '{"text":1,"channel":1,"engagement":0.6402316423874758,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-bench-press'
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
SELECT id, 'es', 'TAH8RxOS0VI', 'Cómo hacer PRESS DE BANCA perfecto', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 190, 0.7862, '{"text":0.5,"channel":1,"engagement":0.9310297767796961,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'close-grip-bench-press'
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
SELECT id, 'en', 'Jvj2wV0vOYU', 'How To: Dumbbell Concentration Curl', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 101, 0.9303, '{"text":1,"channel":1,"engagement":0.6514234982311221,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'concentration-curl'
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
SELECT id, 'es', 'th4ad_vEonc', 'Curl de Bicep Concentrado con apoyo en el Muslo', 'UCfOw8Ddk0jOeCyUJEoIZd3w', 'Asesor Fitness', 141, 0.5968, '{"text":1,"channel":0,"engagement":0.4837981057353751,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'concentration-curl'
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
SELECT id, 'en', 'NGRKFMKhF8s', 'How To: Floor Crunch', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 123, 0.9257, '{"text":1,"channel":1,"engagement":0.6287459673533758,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'crunch-floor'
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
SELECT id, 'en', '8np3vKDBJfc', 'The PERFECT Deadlift (5 Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 57, 0.9452, '{"text":1,"channel":1,"engagement":0.9761346032811647,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
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
SELECT id, 'en', 'LfyQBUKR8SE', 'How To: Barbell Decline Bench Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 124, 0.9295, '{"text":1,"channel":1,"engagement":0.647405537436514,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'decline-bench-press'
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
SELECT id, 'es', 'L1U8yy4OqbQ', 'Press Banca Declinado con Barra - para Pecho', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 73, 0.8559, '{"text":1,"channel":1,"engagement":0.5294472171523258,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'decline-bench-press'
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
SELECT id, 'en', 'QhGU5cmNZds', 'How To: Decline Sit-Up', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 96, 0.9272, '{"text":1,"channel":1,"engagement":0.6359312758643154,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'decline-sit-up'
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
SELECT id, 'es', 'bUxTd61Jo3k', 'Banco romano cómo usarlo', 'UCRy-iIQDljzRDgvoq8UtSng', 'Galvistrainer', 60, 0.4156, '{"text":0.25,"channel":0,"engagement":0.7029747479899534,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'decline-sit-up'
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
SELECT id, 'en', 'vi1-BOcj3cQ', 'Are You Doing Dips Properly? (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 303, 0.9713, '{"text":1,"channel":1,"engagement":0.8563157157603706,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips'
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
SELECT id, 'es', 'DcS44T6Y5GQ', '🔥FONDOS en PARALELAS🔥 || ATENTO a la TÉCNICA ⚠️', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 214, 0.9031, '{"text":1,"channel":1,"engagement":0.7657053741569168,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips'
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
SELECT id, 'en', 'vi1-BOcj3cQ', 'Are You Doing Dips Properly? (AVOID MISTAKES!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 303, 0.9713, '{"text":1,"channel":1,"engagement":0.8563157157603706,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips-2'
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
SELECT id, 'es', 'DcS44T6Y5GQ', '🔥FONDOS en PARALELAS🔥 || ATENTO a la TÉCNICA ⚠️', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 214, 0.9031, '{"text":1,"channel":1,"engagement":0.7657053741569168,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dips-2'
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
SELECT id, 'en', 'ris9tKqMwgU', 'Stop F*cking Up The Arnold Press (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 461, 0.7516, '{"text":0.6666666666666666,"channel":1,"engagement":0.6484708544512047,"duration":0.7194444444444444,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press'
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
SELECT id, 'es', 'V8GcUp4COLg', 'No Arruines el Press Arnold ¡FORMA CORRECTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 461, 0.793, '{"text":0.6666666666666666,"channel":1,"engagement":0.855056901120456,"duration":0.7194444444444444,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press'
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
SELECT id, 'en', 'ris9tKqMwgU', 'Stop F*cking Up The Arnold Press (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 461, 0.7516, '{"text":0.6666666666666666,"channel":1,"engagement":0.6484708544512047,"duration":0.7194444444444444,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press-2'
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
SELECT id, 'es', 'fYxSUvIsxoA', 'Haz Esto SIEMPRE que Hagas Press Frontal con Barra ¡MAYOR FUERZA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 358, 0.8303, '{"text":0.6666666666666666,"channel":1,"engagement":0.9016410253880386,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-arnold-press-2'
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
SELECT id, 'en', '6TSP1TRMUzs', 'How To:  Dumbbell Bent-Over Row', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 162, 0.9309, '{"text":1,"channel":1,"engagement":0.6545061362406139,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bent-over-row'
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
SELECT id, 'es', 'D6lpHgyDItk', 'Remo con 2 Mancuernas en Banco Inclinado', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 113, 0.8685, '{"text":1,"channel":1,"engagement":0.592308566946298,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bent-over-row'
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
SELECT id, 'en', 'ICAXJVmOJik', 'Fixed In 60 Seconds: DUMBBELL BICEPS CURL', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 56, 0.7994, '{"text":0.6666666666666666,"channel":1,"engagement":0.7469743093497178,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bicep-curl'
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
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8322, '{"text":0.6666666666666666,"channel":1,"engagement":0.9112380409640392,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bicep-curl'
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
SELECT id, 'en', 'lG3MsPmEQQk', '🔥 Bulgarian Split Squat Tutorial', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 60, 0.875, '{"text":0.75,"channel":1,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bulgarian-split-squat'
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
SELECT id, 'es', 'YCPbCCMLwNc', 'Sentadilla Búlgara Más Fácil ¡CORRIGE TU FORMA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 59, 0.8367, '{"text":0.6666666666666666,"channel":1,"engagement":0.9332895876247617,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-bulgarian-split-squat'
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
SELECT id, 'en', 'z6A4W5Dib28', 'STOP Doing Dumbbell Press Like This', 'UCN3kSAAWJS5rurEKLoVo3dg', 'Jeremy Ethier Shorts', 56, 0.7954, '{"text":0.5,"channel":1,"engagement":0.977024402943326,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-close-grip-press'
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
SELECT id, 'es', '5wN-99Fny5Q', 'DEJA de hacer así el press con mancuernas (5 errores que retrasan el crecimiento de los pectorales)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 433, 0.731, '{"text":0.5,"channel":1,"engagement":0.7562070950592403,"duration":0.7972222222222223,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-close-grip-press'
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
SELECT id, 'en', 'Jvj2wV0vOYU', 'How To: Dumbbell Concentration Curl', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 101, 0.9303, '{"text":1,"channel":1,"engagement":0.6514234982311221,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-concentration-curl'
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
SELECT id, 'es', 'Cl0YsucldGA', '¡Importante al Hacer Curl de Bíceps!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 40, 0.7374, '{"text":0.3333333333333333,"channel":1,"engagement":0.9370910497040842,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-concentration-curl'
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
SELECT id, 'en', 'lJ3QwaXNJfw', 'How To: Dumbbell Deadlift', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 135, 0.9302, '{"text":1,"channel":1,"engagement":0.6510208114964456,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-deadlift'
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
SELECT id, 'es', '7EFlWfvU59w', 'Peso Muerto con Mancuernas - Femoral y Glúteos', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 64, 0.8684, '{"text":1,"channel":1,"engagement":0.5921192302743568,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-deadlift'
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
SELECT id, 'en', '0xRvl4Qv3ZY', 'Decline Dumbbell Bench Press - Chest Exercise', 'UCRnQ0oe-NLWHPt0UUqoDcNQ', 'MyTraining App', 66, 0.6754, '{"text":1,"channel":0,"engagement":0.6272186677127473,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-decline-bench-press'
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
SELECT id, 'es', 'Lp9LLEGJJrI', 'Deja de Hacer Press de Banca con Mancuernas Así ¡TE LO RUEGO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 597, 0.7969, '{"text":0.75,"channel":1,"engagement":0.9386643856970867,"duration":0.3416666666666667,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-decline-bench-press'
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
SELECT id, 'en', 'QsYre__-aro', 'STOP Doing Dumbbell Press Like This (5 Mistakes Slowing Your Chest Gains)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 449, 0.6652, '{"text":0.3333333333333333,"channel":1,"engagement":0.6995850203353625,"duration":0.7527777777777778,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-decline-fly'
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
SELECT id, 'es', 'Lp9LLEGJJrI', 'Deja de Hacer Press de Banca con Mancuernas Así ¡TE LO RUEGO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 597, 0.6719, '{"text":0.3333333333333333,"channel":1,"engagement":0.9386718783256855,"duration":0.3416666666666667,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-decline-fly'
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
SELECT id, 'en', 'BY7UKjJMx2A', 'Correct Form for Shoulder External Rotation Strengthening | Tim Keeley | Physio REHAB', 'UCV40pJjeDHOu_67hEZsgtvw', 'Physio REHAB', 501, 0.4799, '{"text":0.6666666666666666,"channel":0,"engagement":0.5952518259766716,"duration":0.6083333333333333,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-external-rotation'
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
SELECT id, 'es', '0wyKPO5VHrg', 'Rotaciones externas con mancuerna', 'UC0crATOigniLd3-WcvcXoNQ', 'Laura Porras', 12, 0.4806, '{"text":1,"channel":0,"engagement":0.40297310487170157,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-external-rotation'
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
SELECT id, 'en', 'VmB1G1K7v94', 'How To: Dumbbell Chest Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 131, 0.7791, '{"text":0.5,"channel":1,"engagement":0.6456045033906248,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-flat-bench-press'
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
SELECT id, 'es', 'Lp9LLEGJJrI', 'Deja de Hacer Press de Banca con Mancuernas Así ¡TE LO RUEGO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 597, 0.7969, '{"text":0.75,"channel":1,"engagement":0.9386718783256855,"duration":0.3416666666666667,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-flat-bench-press'
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
SELECT id, 'en', 'eozdVDA78K0', 'How To: Dumbbell Flys On A Flat Bench', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 139, 0.8286, '{"text":0.6666666666666666,"channel":1,"engagement":0.6431658994303265,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-flat-fly'
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
SELECT id, 'es', 'OrlXQdNwNwM', 'Aperturas de Pecho con Mancuernas en Banco Plano', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 77, 0.7699, '{"text":0.6666666666666666,"channel":1,"engagement":0.599285857681963,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-flat-fly'
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
SELECT id, 'en', '_LwuS1PdbdM', 'Feel The Dumbbell Fly MORE | Targeting The Muscle', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 370, 0.9124, '{"text":1,"channel":1,"engagement":0.8257556477274511,"duration":0.9722222222222222,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-fly'
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
SELECT id, 'es', 'OtW0EYqBczI', 'Cómo hacer APERTURAS, el ejercicio BÁSICO de toda rutina de pecho #gym #aperturas  #pecho', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.7366, '{"text":0.3333333333333333,"channel":1,"engagement":0.9328227047558063,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-fly'
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
SELECT id, 'en', '-t7fuZ0KhDA', 'How To: Dumbbell Front Raise', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.9284, '{"text":1,"channel":1,"engagement":0.6422102686014663,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-front-raise'
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
SELECT id, 'es', 'HFf5WDmtHuE', '¡Para de Hacer Elevaciones Laterales con Mancuernas Así! (SALVA A UN AMIGO)', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 46, 0.85, '{"text":0.6666666666666666,"channel":1,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-front-raise'
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
SELECT id, 'en', '-t7fuZ0KhDA', 'How To: Dumbbell Front Raise', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 111, 0.9284, '{"text":1,"channel":1,"engagement":0.6422102686014663,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-front-raise-2'
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
SELECT id, 'es', 'WjdE5DLGDdo', 'PARA De Hacer Las FLEXIONES Así (SALVA A UN AMIGO)', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 38, 0.75, '{"text":0.3333333333333333,"channel":1,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-front-raise-2'
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
SELECT id, 'en', 'CkFzgR55gho', 'How to Perform Dumbbell Goblet Squat', 'UCwL6i80ui6Po2Jov2jVRlbQ', 'Physique Development', 87, 0.6244, '{"text":1,"channel":0,"engagement":0.6219762568017894,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-goblet-squat'
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
SELECT id, 'es', 'XANUniwN1Jg', 'La técnica de SENTADILLA GOBLET | Bajo la lupa 🔍', 'UCtnqQa6DyAyHX3YjdB_s2rA', 'Diana Ayala', 367, 0.5689, '{"text":0.6666666666666666,"channel":0,"engagement":0.8543612541904783,"duration":0.9805555555555555,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-goblet-squat'
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
SELECT id, 'en', 'zC3nLlEvin4', 'How To: Dumbbell Hammer Curl', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 123, 0.9277, '{"text":1,"channel":1,"engagement":0.6386245437852958,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-hammer-curl'
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
SELECT id, 'es', 'Cl0YsucldGA', '¡Importante al Hacer Curl de Bíceps!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 40, 0.7374, '{"text":0.3333333333333333,"channel":1,"engagement":0.9371313700439846,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-hammer-curl'
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
SELECT id, 'en', 'xDmFkJxPzeM', 'How To Build Great Glutes with Perfect Hip Thrust Technique (Fix Mistakes!)', 'UC68TLK0mAEzUyHx5x5k-S1Q', 'Jeff Nippard', 432, 0.7848, '{"text":0.6666666666666666,"channel":1,"engagement":0.7741647762062388,"duration":0.8,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-hip-thrust'
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
SELECT id, 'es', 'mbtj1fs-Atk', '[FR] - Elevación de cadera con peso', 'UCdwKJ_Eb6JKHczUrCMBanzA', 'Fitness Republik', 41, 0.4847, '{"text":0.6666666666666666,"channel":0,"engagement":0.42345333266075164,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-hip-thrust'
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
SELECT id, 'en', 'SHsUIZiNdeY', 'Dumbbell Bench Press (BETTER CHEST ACTIVATION!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 330, 0.8731, '{"text":0.75,"channel":1,"engagement":0.7405481217956338,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-incline-bench-press'
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
SELECT id, 'es', 'Lp9LLEGJJrI', 'Deja de Hacer Press de Banca con Mancuernas Así ¡TE LO RUEGO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 597, 0.7969, '{"text":0.75,"channel":1,"engagement":0.9386718783256855,"duration":0.3416666666666667,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-incline-bench-press'
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
SELECT id, 'en', 'DCe8f6vMe9A', 'Stop Screwing Up Incline Dumbbell Curls (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 305, 0.8374, '{"text":0.6666666666666666,"channel":1,"engagement":0.6869003749759358,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-incline-curl'
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
SELECT id, 'es', 'ZY19YNmm7tQ', 'CURL de BÍCEPS en BANCO INCLINADO ¡Hazlo así!', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 61, 0.792, '{"text":0.75,"channel":1,"engagement":0.58481394724168,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-incline-curl'
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
SELECT id, 'en', 'bDaIL_zKbGs', 'How To: Incline Dumbbell Fly || Hit Your Chest HARD!', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 141, 0.9281, '{"text":1,"channel":1,"engagement":0.640295197519163,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-incline-fly'
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
SELECT id, 'es', 'OtW0EYqBczI', 'Cómo hacer APERTURAS, el ejercicio BÁSICO de toda rutina de pecho #gym #aperturas  #pecho', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 45, 0.7366, '{"text":0.3333333333333333,"channel":1,"engagement":0.9328227047558063,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-incline-fly'
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
SELECT id, 'en', 'n5dsI9qQXwY', 'Lateral Raise Technique For Huge Delts | Targeting The Muscle Series', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 388, 0.8203, '{"text":0.6666666666666666,"channel":1,"engagement":0.8905443691149608,"duration":0.9222222222222223,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-lateral-raise'
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
SELECT id, 'es', 'UQkdNBpjFDo', '¡Elevaciones laterales que realmente funcionan! 💪✅', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 42, 0.8249, '{"text":0.6666666666666666,"channel":1,"engagement":0.8743756559740478,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-lateral-raise'
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
SELECT id, 'en', 'PzsMitRdI_8', 'How to do the DUMBBELL LATERAL RAISE! | 2 Minute Tutorial', 'UCOsFVEylgXEcnxAEt9E0c4Q', 'Max Euceda', 121, 0.665, '{"text":1,"channel":0,"engagement":0.8248652301748532,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-lateral-raise-2'
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
SELECT id, 'es', 't9Cb4hLuGfE', 'Truco para ELEVACIONES LATERALES', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 26, 0.8086, '{"text":0.6666666666666666,"channel":1,"engagement":0.9265423991138027,"duration":0.7333333333333333,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-lateral-raise-2'
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
SELECT id, 'en', 'D7KaRcUTQeE', 'How To: Dumbbell Stepping Lunge', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 132, 0.9277, '{"text":1,"channel":1,"engagement":0.6384284777357058,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-lunge'
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
SELECT id, 'es', 'tCl2EQvSJeY', 'Desplantes con mancuernas (Técnica Correcta) 🔥 #shorts', 'UCUGqyrI3X_PIqFx9r8CE81Q', 'Miguel Leon Trainer', 7, 0.3718, '{"text":0.5,"channel":0,"engagement":0.60877929523722,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-lunge'
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
SELECT id, 'en', 'M2rwvNhTOu0', 'The Perfect Overhead Dumbbell Press', 'UC3pNPPqn073XJXluDu0aJhw', '3v', 54, 0.6279, '{"text":1,"channel":0,"engagement":0.6393663741603186,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
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
SELECT id, 'en', '-Vyt2QdsR7E', 'How To: Standing Overhead Dumbbell Tricep Extension', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 103, 0.9323, '{"text":1,"channel":1,"engagement":0.6616523423915743,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-overhead-tricep-extension'
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
SELECT id, 'es', 'a65qMhcum0c', 'Los 2 Ejercicios que Necesitas para TRÍCEPS Más Anchos', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 61, 0.6973, '{"text":0.2,"channel":1,"engagement":0.9365794932265828,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-overhead-tricep-extension'
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
SELECT id, 'en', 'nbcgEmZ0Be4', '3 Reasons You''re Wasting Your Time With Preacher Curls! (3 FIXES!)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 423, 0.7343, '{"text":0.3333333333333333,"channel":1,"engagement":0.758776165417256,"duration":0.825,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-preacher-curl'
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
SELECT id, 'es', 'Q747OxJcpYQ', 'COMO REALIZAR CORRECTAMENTE EL CURL PREDICADOR CON MANCUERNA #gym #bicepsworkout #biceptraining', 'UCaKRxXAzClJUVG0mU5sSv8A', 'Adrián Guillén | Entrenador de hombres online', 40, 0.6298, '{"text":1,"channel":0,"engagement":0.6489496097612667,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-preacher-curl'
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
SELECT id, 'en', 'z6A4W5Dib28', 'STOP Doing Dumbbell Press Like This', 'UCN3kSAAWJS5rurEKLoVo3dg', 'Jeremy Ethier Shorts', 56, 0.9454, '{"text":1,"channel":1,"engagement":0.9768949332400443,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-press'
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
SELECT id, 'es', '5wN-99Fny5Q', 'DEJA de hacer así el press con mancuernas (5 errores que retrasan el crecimiento de los pectorales)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 433, 0.881, '{"text":1,"channel":1,"engagement":0.7562905359841604,"duration":0.7972222222222223,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-press'
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
SELECT id, 'en', 'VmB1G1K7v94', 'How To: Dumbbell Chest Press', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 131, 0.9291, '{"text":1,"channel":1,"engagement":0.6456045033906248,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-press-2'
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
SELECT id, 'es', '5wN-99Fny5Q', 'DEJA de hacer así el press con mancuernas (5 errores que retrasan el crecimiento de los pectorales)', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 433, 0.881, '{"text":1,"channel":1,"engagement":0.7562905359841604,"duration":0.7972222222222223,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-press-2'
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
SELECT id, 'en', 'ZhPOEQJRzBU', 'How To: Dumbbell Pull-Over (Target Chest Or Lats)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 369, 0.7808, '{"text":0.5,"channel":1,"engagement":0.6663107325649243,"duration":0.975,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover'
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
SELECT id, 'es', 'NfCTdUmWYx0', 'Pullover con mancuerna (Espalda)', 'UCkOz-kDMb0OAcfTE87hEMMQ', 'Fran Osés', 88, 0.6218, '{"text":1,"channel":0,"engagement":0.6089865231815647,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover'
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
SELECT id, 'en', 'ZhPOEQJRzBU', 'How To: Dumbbell Pull-Over (Target Chest Or Lats)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 369, 0.7808, '{"text":0.5,"channel":1,"engagement":0.6663107325649243,"duration":0.975,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover-2'
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
SELECT id, 'es', '5XO5KyDUAbE', 'PULLOVER CON MANCUERNA: TÉCNICA, PELIGROS Y ERRORES [Entrenamiento de pectorales y espalda]', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 497, 0.687, '{"text":0.3333333333333333,"channel":1,"engagement":0.87541959456085,"duration":0.6194444444444445,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover-2'
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
SELECT id, 'en', 'ZhPOEQJRzBU', 'How To: Dumbbell Pull-Over (Target Chest Or Lats)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 369, 0.7808, '{"text":0.5,"channel":1,"engagement":0.6663107325649243,"duration":0.975,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover-3'
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
SELECT id, 'es', '5XO5KyDUAbE', 'PULLOVER CON MANCUERNA: TÉCNICA, PELIGROS Y ERRORES [Entrenamiento de pectorales y espalda]', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 497, 0.687, '{"text":0.3333333333333333,"channel":1,"engagement":0.87541959456085,"duration":0.6194444444444445,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover-3'
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
SELECT id, 'en', 'ZhPOEQJRzBU', 'How To: Dumbbell Pull-Over (Target Chest Or Lats)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 369, 0.7058, '{"text":0.25,"channel":1,"engagement":0.6663107325649243,"duration":0.975,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover-back-focus'
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
SELECT id, 'es', 'NfCTdUmWYx0', 'Pullover con mancuerna (Espalda)', 'UCkOz-kDMb0OAcfTE87hEMMQ', 'Fran Osés', 88, 0.6218, '{"text":1,"channel":0,"engagement":0.6089865231815647,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-pullover-back-focus'
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
SELECT id, 'en', 'buuYPLVXsJg', 'How to PROPERLY Dumbbell Rear Delt Fly | Reverse Dumbbell Fly Tutorial', 'UCqV2z4XYLcOLT27AmGT0M6w', 'Colossus Fitness', 211, 0.6415, '{"text":1,"channel":0,"engagement":0.707691551204927,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-rear-delt-fly'
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
SELECT id, 'es', 'xhmvKbKq5as', 'El mejor ejercicio para deltoides posterior con mancuernas #deltoidesposterior #tips', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 43, 0.7852, '{"text":0.5,"channel":1,"engagement":0.9261868990491374,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-rear-delt-fly'
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
SELECT id, 'en', 'gfUg6qWohTk', 'STOP F*cking Up Dumbbell Rows (PROPER FORM!)', 'UCe0TLA0EsQbE-MjuHXevj2A', 'ATHLEAN-X™', 299, 0.7506, '{"text":0.3333333333333333,"channel":1,"engagement":0.7528878608397743,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-renegade-row'
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
SELECT id, 'es', 'BnHyH5PmPFE', 'Los 2 ÚNICOS Ejercicios para DORSALES con Mancuernas que Necesitas ¡ES EN SERIO!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 213, 0.7353, '{"text":0.3333333333333333,"channel":1,"engagement":0.9266645289544625,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-renegade-row'
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
SELECT id, 'en', 'sjlsISvHyZs', 'How To: Dumbbell Reverse Lunge', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 188, 0.9198, '{"text":1,"channel":1,"engagement":0.5989743217498754,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-reverse-lunge'
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
SELECT id, 'en', 'FQKfr1YDhEk', 'How To: Dumbbell Romanian Deadlift', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 119, 0.9317, '{"text":1,"channel":1,"engagement":0.6583498382157801,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-romanian-deadlift'
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
SELECT id, 'es', '_iInoE3IYcE', '🏋️‍♂️ PESO MUERTO RUMANO ¡Isquios vs Glúteos!', 'UCQoN9oXyVuGcQWLlfcNDRgQ', 'Powerexplosive', 38, 0.8272, '{"text":0.75,"channel":1,"engagement":0.7612038658662328,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-romanian-deadlift'
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
SELECT id, 'en', 'pDTHSnoGoEc', 'How To: Alternating Floor Oblique Twist w/ Weight', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 124, 0.7291, '{"text":0.3333333333333333,"channel":1,"engagement":0.6454031201406575,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-russian-twist'
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
SELECT id, 'es', 'YFMENIj5oUA', 'Como hacer GIROS RUSOS con una mancuerna', 'UCc0WW1vOgkm2NyOxHWS8yVg', 'Narekfitness', 82, 0.3691, '{"text":0.3333333333333333,"channel":0,"engagement":0.3453925217841018,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-russian-twist'
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
SELECT id, 'en', 'xDt6qbKgLkY', 'How To: Dumbbell Shrug', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 116, 0.9266, '{"text":1,"channel":1,"engagement":0.6328992664101979,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-shrug'
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
SELECT id, 'es', 'jM8p44gwFPw', '¡Los ÚNICOS 2 ejercicios que hicieron crecer mis hombros estrechos 💪🏼🔥', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 530, 0.6659, '{"text":0.3333333333333333,"channel":1,"engagement":0.8156955266667408,"duration":0.5277777777777778,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-shrug'
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
SELECT id, 'en', 'xDt6qbKgLkY', 'How To: Dumbbell Shrug', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 116, 0.9266, '{"text":1,"channel":1,"engagement":0.6328992664101979,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-shrug-2'
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
SELECT id, 'es', 'jM8p44gwFPw', '¡Los ÚNICOS 2 ejercicios que hicieron crecer mis hombros estrechos 💪🏼🔥', 'UCCvQpJ5_-LGfkeDdl2Etlwg', 'Jeremy Ethier en Español', 530, 0.6659, '{"text":0.3333333333333333,"channel":1,"engagement":0.8156955266667408,"duration":0.5277777777777778,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-shrug-2'
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
SELECT id, 'en', '7D96dK6oaP8', 'Core Stability: Side  Bends or Suitcase Carry? |#AskSquatU Show Ep. 47|', 'UCyPYQTT20IgzVw92LDvtClw', 'Squat University', 399, 0.6953, '{"text":0.3333333333333333,"channel":1,"engagement":0.7807165117868696,"duration":0.8916666666666667,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-side-bend'
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
SELECT id, 'en', 'pYcpY20QaE8', 'How To: Dumbbell Bent-Over Row (Single-Arm)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 140, 0.9283, '{"text":1,"channel":1,"engagement":0.6416947878703823,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-single-arm-row'
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
SELECT id, 'es', 'Pkr1WW3p05A', 'PARA de J*DER el Remo con Mancuerna ¡ESTA ES LA FORMA APROPIADA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 299, 0.8254, '{"text":0.6666666666666666,"channel":1,"engagement":0.8771058440245999,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-single-arm-row'
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
SELECT id, 'en', 'pYcpY20QaE8', 'How To: Dumbbell Bent-Over Row (Single-Arm)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 140, 0.9283, '{"text":1,"channel":1,"engagement":0.6416947878703823,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-single-arm-row-2'
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
SELECT id, 'es', 'Pkr1WW3p05A', 'PARA de J*DER el Remo con Mancuerna ¡ESTA ES LA FORMA APROPIADA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 299, 0.9254, '{"text":1,"channel":1,"engagement":0.8771058440245999,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-single-arm-row-2'
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
SELECT id, 'en', 'ir5PsbniVSc', 'How To: Dumbbell Skull Crusher', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 88, 0.9294, '{"text":1,"channel":1,"engagement":0.646758132950057,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-skull-crusher'
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
SELECT id, 'es', 'f9Mf874XUXs', 'CÓMO HACER ROMPECRÁNEOS CON MANCUERNAS', 'UCpsjXgX3lc_xY87JQLgo4EA', 'Coach Juanky', 136, 0.5759, '{"text":1,"channel":0,"engagement":0.37954683007522694,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-skull-crusher'
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
SELECT id, 'en', 'gcNh17Ckjgg', 'How to PROPERLY Squat for Growth (4 Easy Steps)', 'UCERm5yFZ1SptUEU4wZ2vJvw', 'Jeremy Ethier', 435, 0.7336, '{"text":0.5,"channel":1,"engagement":0.7722530643702902,"duration":0.7916666666666666,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-squat'
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
SELECT id, 'es', 'Xfa3Ql_NwmE', 'Para de J*&ER La Sentadilla Búlgara ¡FORMA CORRECTA!', 'UCAR76PvwLHcHqnbqFIos_Xg', 'ATHLEAN-X Español', 288, 0.781, '{"text":0.5,"channel":1,"engagement":0.9049231530684337,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-squat'
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
SELECT id, 'en', 'x41IWlX4Rqo', 'You''re Doing Calf Raises WRONG', 'UCfQgsKhHjSyRLOp9mnffqVg', 'Renaissance Periodization', 21, 0.62, '{"text":0.25,"channel":1,"engagement":0.7749326766252302,"duration":0.4,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-standing-calf-raise'
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
SELECT id, 'es', 'OF1lY_2uYc4', 'Elevación de Talones con Mancuernas', 'UCm4LIhnHGZXnDJfyx-bv6GA', 'Coach Luis Solís', 44, 0.5799, '{"text":1,"channel":0,"engagement":0.3996105921426052,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-standing-calf-raise'
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
SELECT id, 'en', '9ZknEYboBOQ', 'Dumbbell Step-up - How To', 'UCSzAriYndMjGjJciDYyj47w', 'Bobby Maximus', 25, 0.5892, '{"text":1,"channel":0,"engagement":0.6125271530422361,"duration":0.6666666666666666,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-step-up'
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
SELECT id, 'es', 'motTnJ2z76U', '🔥✅ TÉCNICA Y EL COMO HACER EL STEP-UP CON MANCUERNAS 🔥✅', 'UC06Ht-uZbfZ4EsuFZ3go7yw', 'Motivacion Monstergym', 62, 0.6353, '{"text":1,"channel":0,"engagement":0.6764302369517793,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-step-up'
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
SELECT id, 'en', '2zL-1TYsN_A', 'Dumbbell Sumo Squat: Cues & Common Mistakes', 'UCZNJsnsdpZCJEgDAS4RvMKQ', 'Katie Orlic', 100, 0.6092, '{"text":1,"channel":0,"engagement":0.5459814362794433,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-sumo-squat'
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
SELECT id, 'es', 'N9hsWMBV5gY', 'SENTADILLA SUMO PARA GLUTE0S 🍑 #sentadillasumo #gluteos #glutes #gymgirl #gymrat #gymtips #gym', 'UCBW0QeDdByBkI7eYV1s6oUA', 'Lee Ortiz', 42, 0.5495, '{"text":0.6666666666666666,"channel":0,"engagement":0.7472516884341973,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-sumo-squat'
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
SELECT id, 'en', 'ICAXJVmOJik', 'Fixed In 60 Seconds: DUMBBELL BICEPS CURL', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 56, 0.7994, '{"text":0.6666666666666666,"channel":1,"engagement":0.7471890439497079,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-supination-curl'
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
SELECT id, 'es', 'M67E8xSxrsA', 'Barra VS Mancuerna en CURL DE BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 182, 0.8323, '{"text":0.6666666666666666,"channel":1,"engagement":0.9112855241333159,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-supination-curl'
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
SELECT id, 'en', '6SS6K3lAwZ8', 'How To: Tricep Kickback (Dumbbell)', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 90, 0.9294, '{"text":1,"channel":1,"engagement":0.6470399677970821,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-tricep-kickback'
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
SELECT id, 'es', 'rORCA2JBBUo', 'Patada De Triceps', 'UCX5aaNCuRnsHZCzlqMrGnVA', 'Guero Valle', 47, 0.6, '{"text":0.6666666666666666,"channel":0,"engagement":1,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-tricep-kickback'
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
SELECT id, 'en', 'IhZLB48kluc', 'How To: Dumbbell Upright-Row', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 101, 0.9285, '{"text":1,"channel":1,"engagement":0.6426939990268309,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-upright-row'
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
SELECT id, 'es', 'brSI4bFCV1g', 'Remo al Mentón con Mancuernas para Hombros', 'UCQQ2X96FF1LezYFe6lUUK0w', 'Zonapablo', 64, 0.8521, '{"text":1,"channel":1,"engagement":0.5107287940645697,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-upright-row'
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
SELECT id, 'en', 'Pbmj6xPo-Hw', 'Walking Lunges Exercise Tutorial | Build Legendary Legs & Cardio', 'UCndvbnArPZw7jHRmE9qBcFg', 'Buff Dudes Workouts', 110, 0.6707, '{"text":0.3333333333333333,"channel":1,"engagement":0.6035989287243152,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-walking-lunge'
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
SELECT id, 'es', 'tCl2EQvSJeY', 'Desplantes con mancuernas (Técnica Correcta) 🔥 #shorts', 'UCUGqyrI3X_PIqFx9r8CE81Q', 'Miguel Leon Trainer', 7, 0.3218, '{"text":0.3333333333333333,"channel":0,"engagement":0.60877929523722,"duration":0,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-walking-lunge'
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
SELECT id, 'en', 'OgQU_bbdB7c', '💥 How to Do the Dumbbell Wood Chop (FIX Your Form) | Joey Thurman #shorts', 'UCkIEMcYvltB8mIo--u8q-jw', 'Joey Thurman', 52, 0.6463, '{"text":1,"channel":0,"engagement":0.7317103537997814,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'needs_review'
FROM public.exercise_library WHERE slug = 'dumbbell-wood-chop'
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
SELECT id, 'en', 'ZrpRBgswtHs', 'How To: Zottman Curl', 'UCEtMRF1ywKMc4sf3EXYyDzw', 'ScottHermanFitness', 103, 0.8299, '{"text":0.6666666666666666,"channel":1,"engagement":0.6497153951357,"duration":1,"language":1,"captionsRecency":1}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-zottman-curl'
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
SELECT id, 'es', '8YOUJTmCF_4', '5 errores comunes del CURL de BÍCEPS', 'UCh4VdbK3ybBBwleBdta_GMg', 'BlueGym Animation', 52, 0.7303, '{"text":0.3333333333333333,"channel":1,"engagement":0.9016202012369795,"duration":1,"language":1,"captionsRecency":0}'::jsonb, 'published'
FROM public.exercise_library WHERE slug = 'dumbbell-zottman-curl'
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
